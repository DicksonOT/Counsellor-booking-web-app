import express from 'express'
import upload from '../middlewares/multer.js'
import { 
  appointmentCancelled, 
  appointmentComplete, 
  counsellorAppointments, 
  counsellorLogin, 
  dashBoard, 
  manualAssessment, 
  profileData, 
  updateProfile, 
  registerCounsellor, 
  getUserProfile, 
  createOnlineSession, 
  updateSessionStatus, 
  getCounsellorSessions, 
  getClientAppointments, 
  getClientSessions, 
  startCall, 
  changeAvailability, 
  scheduleSession, 
  joinSession,   
  getActivities, 
  getParticipants,
  getReports,
  reportContent,
  updateActivity, 
  reviewReport, 
  getActivityTemplates, 
  getTemplateDetails, 
  createActivityWithTemplate, 
  getCounsellorClients, 
  getCounsellorChatRooms, 
  startSession, 
  endSession, 
  muteUser, 
  removeUser, 
  getChatRoomDetails,
  unmuteUser,
  getChatRoomMessages,
  sendCounsellorMessage
} from '../controllers/counsellorController.js'
import authCounsellor from '../middlewares/authCounsellor.js'
import userRouter from './userRoute.js'

const counsellorRouter = express.Router()

counsellorRouter.post( '/register', upload.fields([{ name: 'cv' }, { name: 'certificates' }, { name: 'license' }, { name: 'image' }]),  registerCounsellor);
counsellorRouter.post('/login', counsellorLogin)

counsellorRouter.get('/counsellor-appointments', authCounsellor, counsellorAppointments)
counsellorRouter.post('/cancel-appointment', authCounsellor, appointmentCancelled)
counsellorRouter.post('/complete-appointment', authCounsellor, appointmentComplete)

counsellorRouter.get('/clients', authCounsellor, getCounsellorClients);

counsellorRouter.get('/counsellor-dashboard', authCounsellor, dashBoard)
counsellorRouter.get('/profile', authCounsellor, profileData)
counsellorRouter.post('/update-profile', authCounsellor, upload.single('image'), updateProfile)

counsellorRouter.patch('/assess-user', authCounsellor, manualAssessment)

counsellorRouter.get('/client-profile/:userId', authCounsellor, getUserProfile);
counsellorRouter.get('/client-appointments/:userId', authCounsellor, getClientAppointments); 
counsellorRouter.post('/create-session', authCounsellor, createOnlineSession);
counsellorRouter.get('/sessions', authCounsellor, getCounsellorSessions);
counsellorRouter.put('/session/:sessionId/status', authCounsellor, updateSessionStatus);
counsellorRouter.get('/client/:userId/sessions', authCounsellor, getClientSessions);

counsellorRouter.put('/session/:sessionId/start-call', authCounsellor, startCall);

counsellorRouter.post('/change-availability', authCounsellor, changeAvailability)
counsellorRouter.post('/sessions/schedule', authCounsellor, scheduleSession)
 
counsellorRouter.post('/sessions/:sessionId/join', authCounsellor, joinSession)

counsellorRouter.post('/session/:sessionId/notify', authCounsellor, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, type = 'notification' } = req.body;
    
    // Forward to notification function
    req.body = { userId, sessionId, type };
    return sendNotification(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Wellness Activities Routes
counsellorRouter.get('/wellness/activities', authCounsellor, getActivities);    
counsellorRouter.post('/wellness/activities', authCounsellor, createActivityWithTemplate);
counsellorRouter.put('/wellness/activities/:activityId', authCounsellor, updateActivity);
counsellorRouter.get('/wellness/activities/:activityId/participants', authCounsellor, getParticipants);

// Add these routes to your existing counsellor router
counsellorRouter.get('/wellness/templates', authCounsellor, getActivityTemplates);
counsellorRouter.get('/wellness/templates/:activityType', authCounsellor, getTemplateDetails);


// Moderation (reports)
counsellorRouter.post('/report', authCounsellor, reportContent);
counsellorRouter.get('/reports', authCounsellor, getReports);
counsellorRouter.put('/reports/:reportId/review', authCounsellor, reviewReport);

// Chat rooms routes
counsellorRouter.get('/chat-rooms', authCounsellor, getCounsellorChatRooms);
counsellorRouter.get('/chat-room/:roomId', authCounsellor, getChatRoomDetails);
counsellorRouter.post('/chat/:roomId/mute/:userId', authCounsellor, muteUser);
counsellorRouter.post('/chat/:roomId/unmute/:userId', authCounsellor, unmuteUser);
counsellorRouter.delete('/chat/:roomId/remove/:userId', authCounsellor, removeUser);
counsellorRouter.post('/chat/:roomId/start-session', authCounsellor, startSession);
counsellorRouter.post('/chat/:roomId/end-session', authCounsellor, endSession);
counsellorRouter.get('/chat-room/:roomId/messages', authCounsellor, getChatRoomMessages);
counsellorRouter.post('/chat/:roomId/message', authCounsellor, sendCounsellorMessage);


export default counsellorRouter