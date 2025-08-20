import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import assessmentModel from '../models/assessmentModel.js'
import moodModel from '../models/moodModel.js'
import notificationModel from '../models/notificationModel.js';
import Stripe from 'stripe'
import transporter from '../config/email.js'
import sessionModel from '../models/sessionModel.js'
import { sessions } from '../config/websocket.js';
import { initWebSocket } from '../config/websocket.js'

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body


    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for user profile
const userInfo = async (req, res) => {
  try {
    const userId = req.userId
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for updating user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, dob, gender } = req.body
    const userId = req.userId
    const imageFile = req.file

    if (!name || !phone || !dob || !gender || !location) {
      return res.json({ success: false, message: 'Missing details' })
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, location, dob, gender })

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, { image: imageUrl })
    }

    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }

}

// API for getting list of counsellors
const counsellorList = async (req, res) => {
    try {

        const counsellors = await counsellorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, counsellors })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, messsage: error.message })
    }
}

// API for booking appointment 
const bookAppointment = async (req, res) => {
  try {

    const userId = req.userId
    const { slotTime, slotDate, counId } = req.body

    const counData = await counsellorModel.findById(counId).select('-password')

    if (!counData.available) {
      return res.json({ success: false, message: 'Counsellor not available' })
    }

    let slots_booked = counData.slots_booked

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete counData.slots_booked

    const appointmentData = {
      userId,
      counId,
      slotTime,
      slotDate,
      userData,
      counData,
      amount: counData.fees,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await counsellorModel.findByIdAndUpdate(counId, { slots_booked })
    res.json({ success: true, message: 'Appointment Booked' })

    // Email content for user
    const userMailOptions = {
      from: `"Quiet Place" <${process.env.MAIL_USER}>`,
      to: userData.email,
      subject: 'Appointment Confirmation – Quiet Place',
      html: `
    <h2>Appointment Confirmed</h2>
    <p>Hi ${userData.name},</p>
    <p>Your appointment with <strong>${counData.name}</strong> has been successfully booked.</p>
    <p><strong>Date:</strong> ${slotDate}<br/>
    <strong>Time:</strong> ${slotTime}<br/>
    <strong>Location:</strong> ${counData.location}</p>
    <p>Thank you for choosing Quiet Place.</p>
  `,
    };

    // Email content for counsellor
    const counsellorMailOptions = {
      from: `"Quiet Place" <${process.env.MAIL_USER}>`,
      to: counData.email,
      subject: 'New Appointment Booked – Quiet Place',
      html: `
    <h2>New Appointment Alert</h2>
    <p>Hi ${counData.name},</p>
    <p><strong>${userData.name}</strong> has booked an appointment with you.</p>
    <p><strong>Date:</strong> ${slotDate}<br/>
    <strong>Time:</strong> ${slotTime}<br/>
    <strong>User Email:</strong> ${userData.email}<br/>
    <strong>User Phone:</strong> ${userData.phone}</p>
  `,
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(counsellorMailOptions)
    ]);


  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}


// API to get user appointments
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId
    const appointments = await appointmentModel.find({ userId })

    if (!appointments) {
      return res.json({ success: false, message: 'You do not have any appointment' })
    }

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for cancelling appointment 
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'You are not authorised' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // releasing counsellor slot
    const { counId, slotTime, slotDate } = appointmentData

    const counData = await counsellorModel.findById(counId)

    let slots_booked = counData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await counsellorModel.findByIdAndUpdate(counId, { slots_booked })
    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// API for making payment
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorised action' })
    }
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment does not exist or is cancelled' });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY,
            product_data: {
              name: 'Counselling Appointment',
            },
            unit_amount: appointmentData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/my-appointment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { appointmentId: appointmentId.toString() }
    })

    res.json({ success: true, url: session.url })

  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// Stripe Webhook Handler
const StripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)

    console.log(event)
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const appointmentId = session.metadata.appointmentId

      // Update appointment status in DB
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true, paymentId: session.payment_intent })
    }

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for verifying payment
const verifyPayment = async (req, res) => {
  const { sessionId } = req.body

  if (!sessionId) {
    return res.json({ success: false, message: "No session ID provided" })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      await appointmentModel.findByIdAndUpdate(session.metadata.appointmentId, { payment: true, paymentId: session.payment_intent })
      res.json({ success: true, message: 'Payment confirmed!' })
    } else {
      return res.json({ success: false, message: 'Payment failed' })
    }

  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for assessing user with questions
const submitAssessment = async (req, res) => {
  try {
    const userId = req.userId; 
    const { answers } = req.body;

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

    let assessment = await assessmentModel.findOne({ userId });

    const today = new Date().toDateString(); 

    if (assessment) {
      const lastEntry = assessment.scoreHistory[assessment.scoreHistory.length - 1];

      if (lastEntry) {
        const lastEntryDate = new Date(lastEntry.date || assessment.updatedAt).toDateString();

        if (lastEntryDate === today && lastEntry.source === 'assessmentTest') {
          return res.json({
            success: false,
            message: "You've already taken the assessment today. Try again tomorrow.",
          });
        }
      }

      const newEntry = {
        score: totalScore,
        source: 'assessmentTest',
        date: new Date(), 
      };

      assessment.totalScore += totalScore;
      assessment.scoreHistory.push(newEntry);
      await assessment.save();
    } else {
      // First-time assessment
      const newAssessment = {
        userId,
        totalScore,
        scoreHistory: [{
          score: totalScore,
          source: 'assessmentTest',
          date: new Date(),
        }],
      };
     await assessmentModel.create(newAssessment);
    }

    res.json({ success: true, message: "Assessment recorded successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to record assessment." });
  }
};

// API for taken Assessment
const checkAssessmentToday = async (req, res) => {
  try {
    const userId = req.userId;
    const assessment = await assessmentModel.findOne({ userId });

    if (!assessment) {
      return res.json({ takenToday: false });
    }

    const lastEntry = assessment.scoreHistory[assessment.scoreHistory.length - 1];

    const today = new Date().toDateString();
    const lastEntryDate = new Date(lastEntry.date || assessment.updatedAt).toDateString();

    if (lastEntry && lastEntry.source === 'assessmentTest' && lastEntryDate === today) {
      return res.json({ takenToday: true });
    }

    res.json({ takenToday: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ takenToday: false });
  }
};


// API for assesing user 
const chatbotVisit = async (req, res) => {
  const userId = req.userId;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today

    const assessment = await assessmentModel.findOne({ userId });

    // Check if a record exists and if a visit was already recorded today
    if (assessment && assessment.scoreHistory.some(
      entry =>
        entry.source === 'chatbot' &&
        new Date(entry.date).setHours(0, 0, 0, 0) === today.getTime()
    )) {
      // Visit already recorded for today, so do nothing and respond.
      return res.json({ success: true, message: 'Chatbot visit already recorded today.' });
    }

    // If no visit was recorded today (or no assessment exists yet),
    await assessmentModel.findOneAndUpdate(
      { userId },
      {
        $inc: { totalScore: 2 },
        $push: {
          scoreHistory: {
            score: 2,
            source: 'chatbot',
            date: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Chatbot visit recorded successfully.' });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred while recording the visit.' });
  }
};


// API for getting assessment data
const getUserAssessment = async (req, res) => {
  const userId = req.userId;

  try {
    const assessment = await assessmentModel.findOne({ userId });
    if (!assessment) {
      return res.json({ success: false, message: 'Assessment not found' });
    }

    res.json({ success: true, assessment });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: 'Error retrieving assessment' });
  }
};

// API for mood entry
const addMood = async (req, res) => {
 try {
  const { mood, note } = req.body;
  const userId = req.userId;
  await moodModel.create({ user: userId, mood, note });
  res.json({ success: true, message:'Mood recorded' });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: 'Error recording mood' });
 }
};

// API to get mood history
const getMoodHistory = async (req, res) => {
try {
  const userId = req.userId;
  const history = await moodModel.find({ user: userId }).sort({ date: -1 });
  res.json({ success: true, history });
} catch (error) {
  console.log(error.message);
  res.json({ success: false, message: 'Error getting mood history' });
}
};

// API to handle crisis
const handleCrisisSupport = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, moodScore } = req.body;

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Get all approved counselors
    const activeCounselors = await counsellorModel.find({ status: "approved" });

    const recipients = [
      ...activeCounselors.map(c => c.email),
      process.env.MAIL_USER 
    ];

    // Email options
    const mailOptions = {
      from: `"QuietPlace Crisis Alert" <${process.env.MAIL_USER}>`,
      to: recipients,
      subject: "🚨 Crisis Support Request - Immediate Action Needed",
      html: `
        <h2>Crisis Alert from QuietPlace</h2>
        <p><strong>User:</strong> ${user.name} (${user.email}) ${user.phone ? `(${user.phone})` : ''}</p>
        <p><strong>Mood Score:</strong> ${moodScore}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        <a href="${process.env.APP_URL}/counselor/chat/${userId}" style="background:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Respond Now</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success + helplines
    res.json({
      success: true,
      message: "Crisis request sent. Helplines provided.",
      helplines: [
        { name: "Samaritans", phone: "+44 8457 90 90 90" },
        { name: "National Suicide Prevention Lifeline", phone: "+1 800-273-8255" },
        { name: "Lifeline Ghana", phone: "+233 244 852 570" },
      ],
    });

  } catch (error) {
    console.error("Error handling crisis support:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// API for user to join live session
const joinLiveSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId;

    const session = await sessionModel.findById(sessionId)
      .populate('counId', 'name')
      .populate('userId', 'name');

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Authorization check
    if (
      session.userId._id.toString() !== userId &&
      session.counId._id.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to join this session" });
    }

    let updated = false;

    // Ensure roomId exists (important for WebRTC)
    if (!session.roomId) {
      session.roomId = `session-${session._id}`;
      updated = true;
    }

    // Add participant if new
    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      updated = true;
    }

    // If scheduled, activate
    if (session.status === 'scheduled') {
      session.status = 'active';
      session.startTime = new Date();
      updated = true;
    }

    if (updated) {
      await session.save();
    }

    // Notify the other participant
    const otherParticipantId =
      session.userId._id.toString() === userId
        ? session.counId._id
        : session.userId._id;

    await notifyUserInSession(
      otherParticipantId,
      `${session.userId.name || 'A participant'} joined the session.`,
      session
    );

    res.json({
      success: true,
      message: "Joined session successfully",
      session: {
        _id: session._id,
        roomId: session.roomId,
        sessionType: session.sessionType,
        status: session.status,
        participants: session.participants
      }
    });

  } catch (error) {
    console.error("Error in joinLiveSession:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user's sessions 
const getUserSessions = async (req, res) => {
  try {
    const userId = req.userId;

    const sessions = await sessionModel.find({ userId })
      .populate('counId', 'name email speciality image')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const notifyUser = ( message) => {
  const userId = req.userId
  const userSessions = sessions[userId] || [];
  userSessions.forEach(ws => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// API to mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId; // From auth middleware

    // Find and update notification, ensuring user owns it
    const notification = await notificationModel.findOneAndUpdate(
      { 
        _id: notificationId, 
        userId: userId 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.json({
        success: false,
        message: 'Notification not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

//API to mark all notifications as read 
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const result = await notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to delete notification 
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await notificationModel.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.json({
        success: false,
        message: 'Notification not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to get unread notification count 
const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.userId;

    const unreadCount = await notificationModel.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Enhanced getUserNotifications with pagination 
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await notificationModel.countDocuments(query);
    const unreadCount = await notificationModel.countDocuments({ 
      userId, 
      isRead: false 
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        unreadCount,
        hasMore: page * limit < totalNotifications
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


const notifyUserInSession = async (userId, message, sessionData) => {
  try {
    if (sessions[userId]) {
      const notificationPayload = {
        type: 'session_update',
        message,
        sessionData: {
          sessionId: sessionData._id,
          sessionUrl: sessionData.sessionUrl,
          scheduledTime: sessionData.scheduledTime,
          status: sessionData.status
        }
      };

      sessions[userId].forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(notificationPayload));
        }
      });
      console.log(`📱 Session update sent to user ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error notifying user in session:', error);
  }
};

export { registerUser, userLogin, userInfo, updateProfile, bookAppointment, listAppointments, cancelAppointment, paymentStripe, StripeWebhook, verifyPayment, chatbotVisit, getUserAssessment, submitAssessment, checkAssessmentToday, addMood, getMoodHistory, handleCrisisSupport, counsellorList, joinLiveSession , getUserSessions, getUserNotifications, notifyUser, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadNotificationCount}