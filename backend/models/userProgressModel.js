import mongoose from 'mongoose';

const scoreHistorySchema = new mongoose.Schema({
  score: { type: Number, required: true },
  source: { 
    type: String, 
    enum: ['chatbot', 'counselor', 'manual', 'assessmentTest', 'activity', 'appointment'], 
    required: true 
  },
  counId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  date: { type: Date, default: Date.now }
});

const monthlyHistorySchema = new mongoose.Schema({
  month: { type: Number, required: true }, // 0-11
  year: { type: Number, required: true },
  pointsEarned: { type: Number, default: 0 },
  activitiesCompleted: { type: Number, default: 0 },
  postsCreated: { type: Number, default: 0 },
  supportGiven: { type: Number, default: 0 },
  archivedAt: { type: Date, default: Date.now }
});

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  pointsMilestone: { type: Number, required: true }, // Points at which badge was earned
  earnedAt: { type: Date, default: Date.now }
});

const userProgressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true // This already creates an index, so we don't need schema.index({ user: 1 })
  },
  wellnessPoints: { type: Number, default: 0 },
  
  // Monthly tracking
  monthlyStats: {
    currentMonth: { type: Number, default: () => new Date().getMonth() },
    currentYear: { type: Number, default: () => new Date().getFullYear() },
    pointsThisMonth: { type: Number, default: 0 },
    activitiesThisMonth: { type: Number, default: 0 },
    postsThisMonth: { type: Number, default: 0 },
    supportGivenThisMonth: { type: Number, default: 0 }
  },
  
  // Archive of previous months
  monthlyHistory: [monthlyHistorySchema],
  
  // Weekly stats for comparison
  weeklyStats: {
    activitiesCompleted: { type: Number, default: 0 },
    postsCreated: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    lastWeekActivities: { type: Number, default: 0 },
    lastWeekPosts: { type: Number, default: 0 },
    lastWeekPoints: { type: Number, default: 0 },
    weekStartDate: { type: Date, default: Date.now }
  },
  
  // Enhanced badge system - awards every 50 points
  badges: [badgeSchema],

  achievements: [{
    name: { type: String },
    description: { type: String },
    icon: { type: String },
    earnedAt: { type: Date, default: Date.now }
  }],

  streaks: {
    journaling: { 
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastEntry: { type: Date }
    },
    moodCheckin: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastCheckin: { type: Date }
    },
    communityEngagement: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: { type: Date }
    },
    activityCompletion: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: { type: Date }
    }
  },

  completedActivities: [{ 
    activity: { type: mongoose.Schema.Types.ObjectId, ref: 'WellnessActivity' },
    completedAt: { type: Date, default: Date.now },
    pointsEarned: { type: Number, default: 10 },
    title: String,
    activityType: String,
    duration: Number
  }],

  joinedCommunities: [{ 
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    joinedAt: { type: Date, default: Date.now },
    userPostCount: { type: Number, default: 0 },
    lastActivity: { type: Date }
  }],

  supportGiven: { type: Number, default: 0 }, 
  supportReceived: { type: Number, default: 0 },

  totalScore: { type: Number, default: 0 },
  scoreHistory: [scoreHistorySchema],
  
  lastMonthlyReset: { type: Date, default: Date.now },
  lastWeeklyReset: { type: Date, default: Date.now }

}, { timestamps: true });

userProgressSchema.index({ totalScore: -1 });
userProgressSchema.index({ 'badges.earnedAt': -1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;