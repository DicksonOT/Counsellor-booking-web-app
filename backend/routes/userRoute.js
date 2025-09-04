import express from 'express'
import { 
  bookAppointment, 
  cancelAppointment, 
  chatbotVisit, 
  getAssessment,
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
  getUnreadNotificationCount,
  getPrograms,
  enrollProgram, 
  getCommunities, 
  joinCommunity, 
  leaveCommunity,
  getPosts,
  createPost,
  likePost,
  getComments,
  createComment,
  getWellnessActivities,
  joinActivity,
  completeActivity,
  getUserProgress, 
  getMonthlyHistory, 
  getUserPosts,
  getUserCommunities,
  recordCounselorAssessment,
  recordActivityCompletion,
  getAssessmentInsights,
  createDonationPayment, 
  verifyDonationPayment,
  getUserDonationHistory,
  cancelMonthlyDonation,
  getChatRoom, 
  sendMessage, 
  getChatHistory,
  getEnrolledPrograms,
  bulkAnalytics,
  getUserBadges,
  getChatParticipants,
  updateOnlineStatus,
  joinChatRoom
} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import rawBody from '../middlewares/rawBody.js'

const userRouter = express.Router()

// ============= PUBLIC ROUTES =============
userRouter.post('/register', registerUser)
userRouter.post('/login', userLogin)
userRouter.get('/list', counsellorList)
userRouter.get("/get-programs", getPrograms);    

// Payment success redirect (public)
userRouter.get('/payment-success', (req, res) => {
  const { session_id } = req.query
  res.redirect(`${process.env.FRONTEND_URL}/payment-success?session_id=${session_id}`)
})

// Stripe webhook (public, uses rawBody middleware)
userRouter.post('/stripe-webhook', rawBody, StripeWebhook)
userRouter.post('/verify-payment', verifyPayment)

// User profile management
userRouter.get('/info', authUser, userInfo)
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile)

// Appointment management
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-stripe', authUser, paymentStripe)

// Mental health assessments
userRouter.post('/submit-assessment', authUser, submitAssessment);
userRouter.get('/check-assessment-today', authUser, checkAssessmentToday);
userRouter.post('/chatbot-visit', authUser, chatbotVisit);
userRouter.post('/counselor-assessment', authUser, recordCounselorAssessment);
userRouter.post('/activity-completion', authUser, recordActivityCompletion);
// FIXED: Changed route to match frontend expectations
userRouter.get('/get-assessment', authUser, getAssessment);
userRouter.get('/insights', authUser, getAssessmentInsights);

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
userRouter.get('/notifications/unread-count', authUser, getUnreadNotificationCount)
userRouter.patch('/notifications/:notificationId/read', authUser, markNotificationAsRead)
userRouter.patch('/notifications/mark-all-read', authUser, markAllNotificationsAsRead)

// Delete single notification
userRouter.delete('/notifications/:notificationId', authUser, deleteNotification)

// Community routes
userRouter.get('/communities', authUser, getCommunities);
userRouter.post('/communities/:communityId/join', authUser, joinCommunity);
userRouter.post('/communities/:communityId/leave', authUser, leaveCommunity);

// Post routes
userRouter.get('/communities/:communityId/posts', authUser, getPosts);
userRouter.post('/communities/:communityId/posts', authUser, createPost);
userRouter.post('/posts/:postId/like', authUser, likePost);

// Comment routes
userRouter.get('/posts/:postId/comments', authUser, getComments);
userRouter.post('/posts/:postId/comments', authUser, createComment);

// Wellness activity routes
userRouter.get('/wellness/activities', authUser, getWellnessActivities);
userRouter.post('/wellness/activities/:activityId/join', authUser, joinActivity);
userRouter.post('/wellness/activities/:activityId/complete', authUser, completeActivity);

// User progress routes
userRouter.get('/wellness/progress', authUser, getUserProgress);
userRouter.get('/wellness/monthly-history', authUser, getMonthlyHistory);
userRouter.get('/wellness/posts', authUser, getUserPosts);
userRouter.get('/wellness/communities', authUser, getUserCommunities);

// Get user badges
userRouter.get('/badges', authUser, getUserBadges);
userRouter.get('/analytics', authUser, bulkAnalytics);

// Public donation routes
userRouter.post('/create-donation', createDonationPayment);
userRouter.post('/verify-donation', verifyDonationPayment);

// Donations routes 
userRouter.get('/donation-history', authUser, getUserDonationHistory);
userRouter.post('/cancel-monthly-donation', authUser, cancelMonthlyDonation);


userRouter.post("/enroll", authUser, enrollProgram);
userRouter.get('/get-enrollments', authUser, getEnrolledPrograms)

// Chat rooms routes
userRouter.get('/:programId', authUser, getChatRoom);
userRouter.post('/program/:programId/send', authUser, sendMessage);
userRouter.get('/program/:programId/messages', authUser, getChatHistory);
userRouter.get('/program/:programId/participants', authUser, getChatParticipants);
userRouter.post('/program/:programId/join',authUser, joinChatRoom);
userRouter.put('/program/:programId/status',authUser,  updateOnlineStatus);

export default userRouter