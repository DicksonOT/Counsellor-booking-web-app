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

userRouter.post("/enroll", authUser, enrollProgram);

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
userRouter.get('/badges', authUser, async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await UserProgress.findOne({ user: userId }).select('badges totalScore');
    
    if (!progress) {
      return res.json({ 
        success: true, 
        badges: [], 
        totalScore: 0,
        nextBadgeAt: 50
      });
    }
    
    const nextMilestone = Math.ceil(progress.totalScore / 50) * 50;
    const nextBadgeAt = nextMilestone === progress.totalScore ? progress.totalScore + 50 : nextMilestone;
    
    res.json({ 
      success: true, 
      badges: progress.badges || [], 
      totalScore: progress.totalScore || 0,
      nextBadgeAt: nextBadgeAt
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.json({ success: false, message: 'Error fetching badges' });
  }
});

// Bulk data route for analytics
userRouter.get('/analytics', authUser, async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await UserProgress.findOne({ user: userId });
    
    if (!progress) {
      return res.json({ success: false, message: 'No data found' });
    }

    // Prepare analytics data
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentActivities = progress.scoreHistory.filter(entry => 
      new Date(entry.date) >= last30Days
    );

    // Daily breakdown
    const dailyData = {};
    recentActivities.forEach(entry => {
      const dateKey = new Date(entry.date).toDateString();
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { points: 0, activities: 0, sources: new Set() };
      }
      dailyData[dateKey].points += entry.score;
      dailyData[dateKey].activities += 1;
      dailyData[dateKey].sources.add(entry.source);
    });

    // Convert Set to Array for JSON serialization
    Object.keys(dailyData).forEach(date => {
      dailyData[date].sources = Array.from(dailyData[date].sources);
    });

    const analytics = {
      totalPoints: progress.totalScore,
      wellnessPoints: progress.wellnessPoints,
      last30Days: Object.entries(dailyData).map(([date, data]) => ({
        date,
        ...data
      })).sort((a, b) => new Date(a.date) - new Date(b.date)),
      streaks: progress.streaks,
      monthlyStats: progress.monthlyStats,
      weeklyStats: progress.weeklyStats,
      badges: progress.badges || []
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error generating analytics' });
  }
});



// Public donation routes
userRouter.post('/create-donation', createDonationPayment);
userRouter.post('/verify-donation', verifyDonationPayment);

// Protected user routes (require authentication)
userRouter.get('/donation-history', authUser, getUserDonationHistory);
userRouter.post('/cancel-monthly-donation', authUser, cancelMonthlyDonation);

// Webhook route (should be placed BEFORE express.json() middleware)
// app.post('/api/donation-webhook', express.raw({type: 'application/json'}), donationWebhook);


export default userRouter