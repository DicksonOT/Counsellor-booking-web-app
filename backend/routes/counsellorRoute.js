import express from 'express'
import upload from '../middlewares/multer.js'
import { appointmentCancelled, appointmentComplete, counsellorAppointments, counsellorLogin, dashBoard, manualAssessment, profileData, updateProfile, registerCounsellor, getUserProfile, createOnlineSession, updateSessionStatus, getCounsellorSessions, getClientAppointments, getClientSessions, startCall, changeAvailability, scheduleSession, joinSession } from '../controllers/counsellorController.js'
import authCounsellor from '../middlewares/authCounsellor.js'

const counsellorRouter = express.Router()

counsellorRouter.post( '/register', upload.fields([{ name: 'cv' }, { name: 'certificates' }, { name: 'license' }, { name: 'image' }]),  registerCounsellor);
counsellorRouter.post('/login', counsellorLogin)

counsellorRouter.get('/counsellor-appointments', authCounsellor, counsellorAppointments)
counsellorRouter.post('/cancel-appointment', authCounsellor, appointmentCancelled)
counsellorRouter.post('/complete-appointment', authCounsellor, appointmentComplete)

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


// counsellorRouter.post('/send-notification', authCounsellor, sendSessionNotification);
// counsellorRouter.post('/session/:sessionId/reminder', authCounsellor, sendSessionReminder);

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

export default counsellorRouter 


