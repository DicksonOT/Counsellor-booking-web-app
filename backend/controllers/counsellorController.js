import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import validator from 'validator'
import appointmentModel from '../models/appointmentModel.js'
import UserProgress from '../models/userProgressModel.js';
import sessionModel from '../models/sessionModel.js'
import userModel from '../models/userModel.js'
import notificationModel from '../models/notificationModel.js'
import transporter from '../config/email.js';
import { sessions } from '../config/websocket.js';
import { WebSocket } from 'ws';
import { v2 as cloudinary } from 'cloudinary';
import WellnessActivity from '../models/activityModel.js'
import { Report } from '../models/communityModel.js';
import { sendActivityNotifications } from '../utils/utils.js'
import { activityTemplates, validateActivityData, getActivityTemplate } from '../utils/activityTemplate.js'

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

// API for manually assessing users (by counselor)
const manualAssessment = async (req, res) => {
  const counId = req.counId; 
  const { userId, score } = req.body;

  if (!userId || typeof score !== 'number') {
    return res.json({ success: false, message: 'userId and score (number) are required' });
  }

  try {
    // Update UserProgress directly
    const updatedProgress = await UserProgress.findOneAndUpdate(
      { user: userId },
      {
        $inc: { wellnessPoints: score, totalScore: score },
        $push: {
          scoreHistory: { score, source: 'manual', counId, date: new Date() }
        }
      },
      { new: true, upsert: true }
    ).populate('user', 'name email');

    return res.json({ 
      success: true, 
      message: `User scored with ${score} points`,
      progress: updatedProgress
    });

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

// API to get all wellness activities created by counsellor
const getActivities = async (req, res) => {
  try {
    const counId = req.counId;
    
    const activities = await WellnessActivity.find({ createdBy: counId })
      .populate('participants', 'name email image')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    console.log(`Found ${activities.length} activities for counsellor ${counId}`);

    res.json({ 
      success: true, 
      activities: activities || [] 
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to create activity
const createActivityWithTemplate = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      activityType, 
      duration, 
      difficulty, 
      instructions, 
      resources, 
      startDate, 
      endDate,
      useTemplate = false
    } = req.body;
    const counId = req.counId;

    console.log('Creating activity for counsellor:', counId);
    console.log('Activity data:', { title, activityType, difficulty, useTemplate });

    // Validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and description are required' 
      });
    }

    if (!['daily_reflection', 'mood_checking', 'challenge', 'meditation', 'exercise', 'journaling'].includes(activityType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid activity type' 
      });
    }

    // Validate activity data
    validateActivityData({ activityType, duration, startDate, endDate });

    const template = getActivityTemplate(activityType);
    
    // Use template data if requested
    let finalInstructions = instructions;
    let finalResources = resources;
    
    if (useTemplate && template) {
      if (!instructions || instructions.length === 0) {
        finalInstructions = template.defaultInstructions;
      }
      if (!resources || resources.length === 0) {
        finalResources = template.suggestedResources.map(res => res.url);
      }
    }

    // Process resources to match schema
    let processedResources = [];
    if (finalResources && Array.isArray(finalResources)) {
      processedResources = finalResources
        .filter(res => res && res.trim())
        .map((res, index) => ({
          type: template?.suggestedResources[index]?.type || 'article',
          url: res.trim(),
          title: template?.suggestedResources[index]?.title || 'Resource'
        }));
    }

    const activity = new WellnessActivity({
      title: title.trim(),
      description: description.trim(),
      activityType,
      duration: duration ? parseInt(duration) : template?.suggestedDuration || 30,
      difficulty: difficulty || 'beginner',
      instructions: finalInstructions ? finalInstructions.filter(inst => inst && inst.trim()) : [],
      resources: processedResources,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      createdBy: counId,
      isActive: true,
      participantCount: 0,
      // Add template-specific data
      templateData: template ? {
        promptQuestions: template.promptQuestions || [],
        moodScale: template.moodScale || [],
        techniques: template.techniques || [],
        exerciseTypes: template.exerciseTypes || [],
        journalPrompts: template.journalPrompts || [],
        challengeTypes: template.challengeTypes || []
      } : {}
    });

    await activity.save();

    const counsellor = await counsellorModel.findById(counId, 'name email');

    // Notify users in the activity's community
    const users = await userModel.find({ community: activity.communityId }, 'name email');
    await sendActivityNotifications(users, counsellor, activity, false);
    
    console.log('Activity created successfully:', activity._id);
    
    res.status(201).json({ 
      success: true, 
      activity,
      template: template ? {
        name: template.name,
        suggestedDuration: template.suggestedDuration,
        maxDuration: template.maxDuration
      } : null,
      message: 'Activity created successfully'
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create activity'
    });
  }
};

// API to get all activity templates
const getActivityTemplates = async (req, res) => {
  try {
    const templates = Object.keys(activityTemplates).map(key => ({
      type: key,
      name: activityTemplates[key].name,
      description: activityTemplates[key].description,
      suggestedDuration: activityTemplates[key].suggestedDuration,
      maxDuration: activityTemplates[key].maxDuration
    }));

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get activity templates'
    });
  }
};

// API to get specific template details
const getTemplateDetails = async (req, res) => {
  try {
    const { activityType } = req.params;
    const template = getActivityTemplate(activityType);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Get template details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get template details'
    });
  }
};

// Update activity
const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const updates = { ...req.body };
    const counId = req.counId;

    console.log('Updating activity:', activityId, 'for counsellor:', counId);

    // Process resources if provided
    if (updates.resources && Array.isArray(updates.resources)) {
      updates.resources = updates.resources
        .filter(res => res && res.trim())
        .map(res => ({
          type: 'article',
          url: res.trim(),
          title: 'Resource'
        }));
    }

    // Filter instructions
    if (updates.instructions && Array.isArray(updates.instructions)) {
      updates.instructions = updates.instructions.filter(inst => inst && inst.trim());
    }

    const activity = await WellnessActivity.findOneAndUpdate(
      { _id: activityId, createdBy: counId },
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found or unauthorized' 
      });
    }

  const counsellor = await counsellorModel.findById(counId, 'name email');

// Populate participants so we have their emails
await activity.populate('participants', 'name email');
await sendActivityNotifications(activity.participants, counsellor, activity, true);


    console.log('Activity updated successfully:', activity._id);

    res.json({ 
      success: true, 
      activity,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update activity'
    });
  }
};

// Get activity participants and completions
const getParticipants = async (req, res) => {
  try {
    const { activityId } = req.params;
    const counId = req.counId;

    console.log('Getting participants for activity:', activityId);

    const activity = await WellnessActivity.findOne({ 
      _id: activityId, 
      createdBy: counId 
    })
      .populate('participants', 'name email image')
      .populate('completions.user', 'name email image');

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: 'Activity not found or unauthorized' 
      });
    }

    console.log(`Activity has ${activity.participants.length} participants and ${activity.completions.length} completions`);

    res.json({
      success: true,
      activity: {
        _id: activity._id,
        title: activity.title,
        participantCount: activity.participantCount
      },
      participants: activity.participants || [],
      completions: activity.completions || []
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get participants'
    });
  }
};

// Report content (for counsellors to report inappropriate content)
const reportContent = async (req, res) => {
  try {
    const { contentType, contentId, reason, description } = req.body;
    const counId = req.counId;

    console.log('Counsellor reporting content:', { contentType, contentId, reason });

    if (!contentType || !contentId || !reason) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content type, content ID, and reason are required' 
      });
    }

    // Validate content type
    if (!['post', 'comment', 'user'].includes(contentType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid content type' 
      });
    }

    // Validate reason
    const validReasons = ['harassment', 'hate_speech', 'spam', 'inappropriate_content', 'crisis_concern', 'misinformation', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid report reason' 
      });
    }

    const report = new Report({
      reporter: counId,
      reportedContent: { 
        contentType, 
        contentId: new mongoose.Types.ObjectId(contentId)
      },
      reason,
      description: description || '',
      status: 'pending'
    });

    await report.save();
    
    console.log('Report submitted successfully:', report._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: report._id
    });
  } catch (error) {
    console.error('Report content error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit report'
    });
  }
};

// Get reports (for counsellors to review)
const getReports = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 10 } = req.query;

    console.log('Getting reports with status:', status);

    const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status filter' 
      });
    }

    const reports = await Report.find({ status })
      .populate('reporter', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalReports = await Report.countDocuments({ status });

    console.log(`Found ${reports.length} reports out of ${totalReports} total`);

    res.json({ 
      success: true, 
      reports: reports || [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReports / parseInt(limit)),
        totalReports,
        hasMore: parseInt(page) < Math.ceil(totalReports / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to get reports'
    });
  }
};

// Review report (for counsellors to take action on reports)
const reviewReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { actionTaken, reviewNotes } = req.body;
    const counId = req.counId;

    console.log('Reviewing report:', reportId, 'action:', actionTaken);

    if (!actionTaken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Action taken is required' 
      });
    }

    // Validate action
    const validActions = ['none', 'warning', 'content_removed', 'user_suspended', 'escalated'];
    if (!validActions.includes(actionTaken)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid action type' 
      });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status: 'reviewed',
        reviewedBy: counId,
        actionTaken,
        reviewNotes: reviewNotes || ''
      },
      { new: true }
    )
    .populate('reporter', 'name email')
    .populate('reviewedBy', 'name');

    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: 'Report not found' 
      });
    }

    console.log('Report reviewed successfully:', report._id);

    res.json({ 
      success: true, 
      report,
      message: 'Report reviewed successfully'
    });
  } catch (error) {
    console.error('Review report error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to review report'
    });
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
  joinSession, 
  createActivityWithTemplate,
  getParticipants,
  getReports,
  reportContent,
  updateActivity,
  reviewReport, 
  getActivities,
  createInAppNotification,
  sendRealTimeNotification,
  getActivityTemplates,
  getTemplateDetails
};
