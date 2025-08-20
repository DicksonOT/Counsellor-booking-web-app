import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import validator from 'validator'
import appointmentModel from '../models/appointmentModel.js'
import assessmentModel from '../models/assessmentModel.js';
import sessionModel from '../models/sessionModel.js'
import userModel from '../models/userModel.js'
import notificationModel from '../models/notificationModel.js'
import transporter from '../config/email.js';
import { sessions } from '../config/websocket.js';
import { WebSocket } from 'ws';
import { v2 as cloudinary } from 'cloudinary';

// API for counsellor register
const registerCounsellor = async (req, res) => {
  try {
    const {
      name, email, password, gpcNumber,
      degree, experienceYears, specialty, about,
      fees, location
    } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email' });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload files to Cloudinary
    const uploadToCloudinary = async (filePath) => {
      const result = await cloudinary.uploader.upload(filePath, { folder: 'quietplace/couns' });
      return result.secure_url;
    };

    const cvUrl = req.files['cv']?.[0] ? await uploadToCloudinary(req.files['cv'][0].path) : null;
    const licenseUrl = req.files['license']?.[0] ? await uploadToCloudinary(req.files['license'][0].path) : null;
    const imageUrl = req.files['image']?.[0] ? await uploadToCloudinary(req.files['image'][0].path) : null;
    const certificateUrls = req.files['certificates']
      ? await Promise.all(req.files['certificates'].map(file => uploadToCloudinary(file.path)))
      : [];

    const newcoun = new counsellorModel({
      name,
      email,
      password: hashedPassword,
      gpcNumber,
      degree,
      experienceYears,
      specialty,
      about,
      fees,
      location,
      cvPath: cvUrl,
      licensePath: licenseUrl,
      image: imageUrl,
      certificatePaths: certificateUrls,
    });

    await newcoun.save();

    // Auto-reply email
    await transporter.sendMail({
      from: `"Quiet Place" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Registration Received',
      html: `
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for registering as a counselor with Quiet Place.</p>
        <p>Your application is under review. We'll get back to you shortly.</p>
        <br>
        <p>Warm regards,<br/>The Quiet Place Team</p>
      `,
    });

    res.json({ success: true, message: 'Registered successfully. Your application is being reviewed.' });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API for counsellor login
const counsellorLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const coun = await counsellorModel.findOne({ email })

    if (!coun) {
      return res.json({ success: false, message: 'Counsellor does not exist' })
    }

    const isMatch = await bcrypt.compare(password, coun.password)

    if (isMatch) {
      const token = jwt.sign({ _id: coun._id }, process.env.JWT_SECRET)
      return res.json({ success: true, token })
    } else {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// API for changing availability
const changeAvailability = async (req, res) => {
  try {
    const counId = req.counId

    const counData = await counsellorModel.findById(counId)
    await counsellorModel.findByIdAndUpdate(counId, { available: !counData.available })

    res.json({ success: true, message: 'Availability Changed' })

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}

// API for getting appointments
const counsellorAppointments = async (req, res) => {
  try {
    const counId = req.counId

    const appointments = await appointmentModel.find({ counId })
    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for completing appointment
const appointmentComplete = async (req, res) => {
  try {
    const counId = req.counId
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.counId === counId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      res.json({ success: true, message: 'Appointment completed' })
    } else {
      return res.json({ success: false, message: 'Mark failed' })
    }

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for cancelling appointments
const appointmentCancelled = async (req, res) => {
  try {
    const counId = req.counId
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.counId === counId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      res.json({ success: true, message: 'Appointment cancelled' })
    } else {
      return res.json({ success: false, message: 'Cancellation failed' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for counsellor dashboard
const dashBoard = async (req, res) => {
  try {
    const counId = req.counId

    const appointments = await appointmentModel.find({ counId })
    let earnings = 0

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += Math.floor(item.amount - 0.1 * item.amount)
      }
    })

    let users = []
    appointments.map((item) => {
      if (!users.includes(item.userId)) {
        users.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      users: users.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for profile data
const profileData = async (req, res) => {
  try {
    const counId = req.counId
    const profile = await counsellorModel.findById(counId).select('-password')

    res.json({ success: true, profile })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for updating profile
const updateProfile = async (req, res) => {
  try {
    const counId = req.counId;

    let { name, degree, experience, about, fees, location, available, preferredSlots, sessionType, timeZone } = req.body;
    const image = req.file

    // Parse preferredSlots if it's a string (from FormData)
    if (preferredSlots && typeof preferredSlots === "string") {
      try {
        preferredSlots = JSON.parse(preferredSlots);
      } catch (err) {
        console.error("Error parsing preferredSlots:", err);
        preferredSlots = [];
      }
    }

    const updateData = {
      name,
      degree,
      experience,
      about,
      fees,
      location,
      available,
      preferredSlots,
      sessionType,
      timeZone
    };

    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image.path, {
        resource_type: "image"
      });
      updateData.image = imageUpload.secure_url;
    }

    await counsellorModel.findByIdAndUpdate(counId, updateData, { new: true });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API for manually assessing users
const manualAssessment = async (req, res) => {
  const counId = req.counId;
  const { userId, score } = req.body;

  if (!userId || typeof score !== 'number') {
    return res.json({ success: false, message: 'userId and score (number) are required' });
  }

  try {
    await assessmentModel.findOneAndUpdate(
      { userId },
      {
        $inc: { totalScore: score },
        $push: {
          scoreHistory: { score, source: 'manual', counId, date: new Date() },
        }
      },
      { new: true, upsert: true }
    );

    return res.json({ success: true, message: `You scored with ${score} points` });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// API for user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const counId = req.counId;

    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Check if counsellor has permission to view this user
    const hasAppointment = await appointmentModel.findOne({
      userId: userId,
      counId: counId
    });

    if (!hasAppointment) {
      return res.json({ success: false, message: 'No appointment found with this user' });
    }

    res.json({ success: true, userData: user });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get client appointments 
const getClientAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const counId = req.counId;

    const appointments = await appointmentModel.find({
      userId: userId,
      counId: counId
    })
      .populate('userId', 'name email image')
      .populate('counId', 'name speciality')
      .sort({ createdAt: -1 });

    res.json({ success: true, appointments });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get client sessions
const getClientSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const counId = req.counId;

    const sessions = await sessionModel.find({
      userId: userId,
      counId: counId
    })
      .populate('userId', 'name email image')
      .populate('counId', 'name speciality')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to create session with integrated notifications
const createOnlineSession = async (req, res) => {
  try {
    const counId = req.counId;
    const { userId, appointmentId, sessionType, duration, notes, scheduledTime } = req.body;

    if (!userId || !sessionType || !duration) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    const validSessionTypes = ['video', 'audio', 'chat'];
    if (!validSessionTypes.includes(sessionType)) {
      return res.json({ success: false, message: 'Invalid session type' });
    }

    // Get counsellor and user details
    const [counsellor, user] = await Promise.all([
      counsellorModel.findById(counId),
      userModel.findById(userId)
    ]);

    if (!counsellor || !user) {
      return res.json({ success: false, message: 'Counsellor or user not found' });
    }

    const sessionData = {
      counId,
      userId,
      appointmentId,
      sessionType,
      duration: parseInt(duration),
      notes,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(),
      status: 'scheduled',
      createdAt: new Date(),
      participants: []
    };

    const session = new sessionModel(sessionData);
    await session.save();

    let sessionUrl = null;
    if (sessionType === 'video' || sessionType === 'audio') {
      const roomId = `session_${session._id}_${Date.now()}`;
      sessionUrl = `${process.env.FRONTEND_URL}/session/${roomId}`;
      session.roomId = roomId;
      session.sessionUrl = sessionUrl;
      await session.save();
    }

    // Send all notifications
    await sendSessionNotifications(user, counsellor, session);

    res.json({
      success: true,
      message: 'Online session created and user notified',
      session: {
        _id: session._id,
        sessionUrl,
        roomId: session.roomId,
        scheduledTime: session.scheduledTime,
        sessionType: session.sessionType,
        status: session.status
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get counsellor sessions
const getCounsellorSessions = async (req, res) => {
  try {
    const counId = req.counId;

    const sessions = await sessionModel.find({ counId })
      .populate('userId', 'name email image')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update session status
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, notes } = req.body;
    const counId = req.counId;

    const validStatuses = ['scheduled', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.json({ success: false, message: 'Invalid status' });
    }

    const session = await sessionModel.findOne({
      _id: sessionId,
      counId
    }).populate('userId', 'name email');

    if (!session) {
      return res.json({ success: false, message: 'Session not found' });
    }

    // Update session fields
    session.status = status;
    if (notes) session.notes = notes;
    if (status === 'completed') session.endTime = new Date();
    if (status === 'active' && !session.startTime) session.startTime = new Date();

    await session.save();

    // Notify user of status change
    if (status === 'active' || status === 'completed' || status === 'cancelled') {
      await notifyUserInSession(
        session.userId._id, 
        `Your session status has been updated to: ${status}`, 
        session
      );
    }

    res.json({ success: true, message: 'Session updated successfully', session });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to start call
const startCall = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await sessionModel.findByIdAndUpdate(
      sessionId, 
      { status: 'active', startTime: new Date() },
      { new: true }
    ).populate('userId', 'name');

    if (!session) {
      return res.json({ success: false, message: 'Session not found' });
    }

    // Create a WebRTC room ID (could just use session._id)
    const roomId = `session-${session._id}`;
    session.sessionUrl = `/therapy-session/${roomId}`;
    await session.save();

    // Notify user to join the WebRTC session
    await notifyUserInSession(
      session.userId._id,
      `Your counselling session has started. Join now!`,
      { ...session.toObject(), roomId }
    );

    res.json({ 
      success: true, 
      message: 'Call started and user notified', 
      roomId,
      sessionUrl: session.sessionUrl 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to start call' });
  }
};

// API to schedule session
const scheduleSession = async (req, res) => {
  try {
    const { userId, sessionType, scheduledTime, duration, sessionUrl } = req.body;
    const counId = req.counId;

    const newSession = await sessionModel.create({
      userId,
      counId,
      sessionType,
      scheduledTime,
      duration,
      sessionUrl,
      status: 'scheduled'
    });

    const [user, counselor] = await Promise.all([
      userModel.findById(userId),
      counsellorModel.findById(counId)
    ]);

    if (!user || !counselor) {
      return res.status(404).json({ error: 'User or counselor not found' });
    }

    await sendSessionNotifications(user, counselor, newSession);

    res.status(201).json({
      message: 'Session scheduled successfully',
      session: newSession
    });

  } catch (error) {
    console.error('Error scheduling session:', error);
    res.status(500).json({ error: 'Failed to schedule session' });
  }
};

// API to join session
const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await sessionModel.findById(sessionId)
      .populate('userId', 'name')
      .populate('counId', 'name');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.status = 'active';
    session.joinedAt = new Date();
    await session.save();

    // Notify the other participant
    const otherUserId = session.userId._id.toString() === userId ? 
      session.counId._id : session.userId._id;

    await notifyUserInSession(otherUserId, `${session.userId.name} joined the session`, session);

    res.json({ message: 'Joined session successfully', session });

  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
};

// =================== HELPER FUNCTIONS ===================

// Send all session notifications
const sendSessionNotifications = async (user, counselor, session) => {
  try {
    await Promise.all([
      sendSessionEmail(user, counselor, session),
      createInAppNotification(user._id, counselor, session),
      sendRealTimeNotification(user._id, counselor, session)
    ]);
    
    console.log(`✅ All notifications sent for session ${session._id}`);
  } catch (error) {
    console.error('❌ Error sending session notifications:', error);
  }
};

// Send session email
const sendSessionEmail = async (user, counselor, session) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_USER || 'noreply@quietplace.com',
      to: user.email,
      subject: '🎯 New Therapy Session Scheduled - QuietPlace',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">QuietPlace</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;">Your wellness journey continues</p>
          </div>
          
          <div style="padding: 30px; background-color: white; margin: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2d3748; margin-top: 0;">Session Scheduled Successfully! 🎉</h2>
            <p style="color: #4a5568; font-size: 16px;">Hello ${user.name},</p>
            <p style="color: #4a5568; font-size: 16px;">Your ${session.sessionType} session has been scheduled with ${counselor.name}.</p>
            
            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4299e1;">
              <h3 style="margin-top: 0; color: #2d3748; font-size: 18px;">📅 Session Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Session Type:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${session.sessionType?.charAt(0).toUpperCase() + session.sessionType?.slice(1)} Call</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${new Date(session.scheduledTime).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Duration:</td>
                  <td style="padding: 8px 0; color: #2d3748;">${session.duration || 60} minutes</td>
                </tr>
                ${session.sessionUrl ? `
                <tr>
                  <td style="padding: 8px 0; color: #4a5568; font-weight: 600;">Join Link:</td>
                  <td style="padding: 8px 0;">
                    <a href="${session.sessionUrl}" style="color: #4299e1; text-decoration: none; font-weight: 600;">
                      Click to Join Session →
                    </a>
                  </td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            ${session.sessionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${session.sessionUrl}" style="display: inline-block; background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px;">
                Join Your Session Now
              </a>
            </div>
            ` : ''}
            
            <p style="color: #718096; font-size: 14px;">
              Need help? Contact support@quietplace.com<br>
              <strong>The QuietPlace Team</strong>
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Session email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Error sending session email:', error);
  }
};

// Create in-app notification
const createInAppNotification = async (userId, counselor, session) => {
  try {
    const notification = await notificationModel.create({
      userId: userId,
      message: `New ${session.sessionType} session scheduled with ${counselor.name}`,
      type: 'session_scheduled',
      data: {
        sessionId: session._id,
        sessionUrl: session.sessionUrl,
        scheduledTime: session.scheduledTime,
        duration: session.duration,
        counsellorName: counselor.name
      },
      isRead: false
    });

    return notification;
  } catch (error) {
    console.error('❌ Error creating in-app notification:', error);
  }
};

// Send real-time notification
const sendRealTimeNotification = async (userId, counselor, session) => {
  try {
    if (sessions[userId]) {
      const notificationPayload = {
        type: 'notification',
        notification: {
          message: `New ${session.sessionType} session scheduled with ${counselor.name}`,
          type: 'session_scheduled',
          data: {
            sessionId: session._id,
            sessionUrl: session.sessionUrl,
            scheduledTime: session.scheduledTime,
            counsellorName: counselor.name
          },
          createdAt: new Date(),
          isRead: false
        }
      };

      sessions[userId].forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(notificationPayload));
        }
      });
      console.log(`📱 Real-time notification sent to user ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error sending real-time notification:', error);
  }
};

// Notify user in session
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

export {
  registerCounsellor,
  counsellorLogin,
  changeAvailability,
  counsellorAppointments,
  appointmentComplete,
  appointmentCancelled,
  dashBoard,
  profileData,
  updateProfile,
  manualAssessment,
  getUserProfile,
  getClientAppointments,
  getClientSessions,
  createOnlineSession,
  getCounsellorSessions,
  updateSessionStatus,
  startCall,
  scheduleSession,
  joinSession
};
