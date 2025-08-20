import express from 'express'
import { 
  bookAppointment, 
  cancelAppointment, 
  chatbotVisit, 
  getUserAssessment, 
  listAppointments, 
  paymentStripe, 
  registerUser, 
  StripeWebhook, 
  updateProfile, 
  userInfo, 
  userLogin, 
  verifyPayment, 
  submitAssessment, 
  checkAssessmentToday, 
  addMood, 
  getMoodHistory, 
  handleCrisisSupport, 
  counsellorList, 
  joinLiveSession, 
  getUserSessions, 
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import rawBody from '../middlewares/rawBody.js'

const userRouter = express.Router()

// ============= PUBLIC ROUTES =============
userRouter.post('/register', registerUser)
userRouter.post('/login', userLogin)
userRouter.get('/list', counsellorList)

// Payment success redirect (public)
userRouter.get('/payment-success', (req, res) => {
  const { session_id } = req.query
  res.redirect(`${process.env.FRONTEND_URL}/payment-success?session_id=${session_id}`)
})

// Stripe webhook (public, uses rawBody middleware)
userRouter.post('/stripe-webhook', rawBody, StripeWebhook)
userRouter.post('/verify-payment', verifyPayment)

// ============= PROTECTED ROUTES =============
// User profile management
userRouter.get('/info', authUser, userInfo)
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile)

// Appointment management
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-stripe', authUser, paymentStripe)

// Mental health assessments
userRouter.post('/submit-assessment', authUser, submitAssessment)
userRouter.get('/check-assessment', authUser, checkAssessmentToday)
userRouter.get('/get-assessment', authUser, getUserAssessment)
userRouter.patch('/assess-chatbot', authUser, chatbotVisit)

// Mood tracking
userRouter.post('/add-mood', authUser, addMood)
userRouter.get('/mood-history', authUser, getMoodHistory)

// Crisis support
userRouter.post('/crisis-support', authUser, handleCrisisSupport)

// Live sessions
userRouter.post('/join-session', authUser, joinLiveSession)
userRouter.get('/sessions', authUser, getUserSessions)

// Get user notifications with optional pagination and filtering
userRouter.get('/notifications', authUser, getUserNotifications)

// Get unread notification count
userRouter.get('/notifications/unread-count', authUser, getUnreadNotificationCount)

// Mark single notification as read
userRouter.patch('/notifications/:notificationId/read', authUser, markNotificationAsRead)

// Mark all notifications as read
userRouter.patch('/notifications/mark-all-read', authUser, markAllNotificationsAsRead)

// Delete single notification
userRouter.delete('/notifications/:notificationId', authUser, deleteNotification)

export default userRouter