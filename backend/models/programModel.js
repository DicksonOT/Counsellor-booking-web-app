import mongoose from "mongoose";

// ------------------- MODULE SCHEMA -------------------
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: { type: Number, default: 0 }, // Duration in minutes
  order: { type: Number, required: true },
  content: {
    type: { type: String, enum: ['video', 'audio', 'text', 'interactive'], required: true },
    url: String,
    text: String
  },
  objectives: [String],
  resources: [String],
  isCompleted: { type: Boolean, default: false }
});

// ------------------- PROGRAM SCHEMA -------------------
const programSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 200 },
  description: { type: String, required: true, maxLength: 1000 },
  shortDescription: { type: String, maxLength: 300 },

  // Duration & Difficulty
  duration: { 
    value: { type: Number, required: true, default: 0 }, 
    unit: { type: String, enum: ['days', 'weeks', 'months'], default: 'days' }
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true,
    default: 'Beginner'
  },

  // Categorization
  category: { 
    type: String, 
    enum: [
      'Anxiety Management', 
      'Depression Support', 
      'Stress Relief', 
      'Mindfulness', 
      'Self-Care', 
      'Relationships', 
      'Sleep Health',
      'Nutrition',
      'Mental Health',
      'Exercise & Movement',
      'Personal Growth'
    ], 
    required: true,
    default: 'Personal Growth'
  },
  tags: [{ type: String, trim: true }],

  // Instructor Info
  instructor: {
    name: { type: String, required: true, default: "Anonymous Instructor" },
    title: { type: String, default: "" },
    bio: { type: String, default: "" },
    credentials: { type: [String], default: [] }
  },

  // Counselor & Moderator Assignments
  assignedCounselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' },
  assignedModerator: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' },
  counselors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor' }],

  // Program Structure
  modules: [moduleSchema],
  totalModules: { type: Number, default: 0 },

  // Engagement Metrics
  rating: { 
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 }
  },
  participants: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 }, 

  // Content
  thumbnail: { type: String, required: true, default: "default-thumbnail.jpg" },
  images: { type: [String], default: [] },
  videoTrailer: { type: String, default: "" },

  // Program Details
  outcome: { type: String, required: true, default: "Program outcome not specified." },
  whatYouWillLearn: { type: [String], default: [] },
  prerequisites: { type: [String], default: [] },
  features: { type: [String], default: [] },

  // Pricing & Access
  price: { type: String, enum: ["Free", "Premium"], default: "Free" },
  premiumPrice: { type: Number, default: 0 }, 

  // Status
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isActive: { type: Boolean, default: true },
  publishedAt: { type: Date, default: null },

  // Wellness Tracking
  targetAudience: { type: [String], default: [] },
  healthConditions: { type: [String], default: [] },
  mentalHealthAreas: { type: [String], default: [] },

  // Community
  allowDiscussion: { type: Boolean, default: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },

  // Tracking
  progressTrackingEnabled: { type: Boolean, default: true },
  certificateEnabled: { type: Boolean, default: false },
  pointsReward: { type: Number, default: 50 }, 

  // Reviews
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxLength: 500 },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],

  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    avgTimeToComplete: { type: Number, default: 0 },
    monthlyEnrollments: [{
      month: { type: Number, default: 0 },
      year: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    }]
  },

  // SEO
  slug: { type: String, unique: true, sparse: true },
  metaDescription: { type: String, default: "" },
  keywords: { type: [String], default: [] }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ------------------- VIRTUALS -------------------

// Completion Percentage
programSchema.virtual('completionPercentage').get(function() {
  if (!this.analytics || !this.analytics.enrollments || this.analytics.enrollments === 0) return 0;
  const completions = this.analytics.completions || 0;
  return Math.round((completions / this.analytics.enrollments) * 100);
});

// Average Rating
programSchema.virtual('averageRating').get(function() {
  if (!this.reviews || !Array.isArray(this.reviews) || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / this.reviews.length).toFixed(1);
});

// All Counselors
programSchema.virtual('allCounselors').get(function() {
  const counselors = [];
  if (this.assignedCounselor) counselors.push(this.assignedCounselor);
  if (this.counselors && this.counselors.length > 0) counselors.push(...this.counselors);
  return counselors.filter((c, i, self) => i === self.findIndex(x => x?.toString() === c?.toString()));
});

// All Moderators
programSchema.virtual('allModerators').get(function() {
  const moderators = [];
  if (this.assignedModerator) moderators.push(this.assignedModerator);
  if (this.moderators && this.moderators.length > 0) moderators.push(...this.moderators);
  return moderators.filter((m, i, self) => i === self.findIndex(x => x?.toString() === m?.toString()));
});

// ------------------- MIDDLEWARE -------------------

// Pre-save slug & module count
programSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.modules && Array.isArray(this.modules)) {
    this.totalModules = this.modules.length;
  }
  next();
});

// ------------------- INDEXES -------------------
programSchema.index({ title: 'text', description: 'text', tags: 'text' });
programSchema.index({ category: 1, difficulty: 1 });
programSchema.index({ 'rating.average': -1 });
programSchema.index({ participants: -1 });
programSchema.index({ createdAt: -1 });
programSchema.index({ slug: 1 });
programSchema.index({ assignedCounselor: 1 });
programSchema.index({ assignedModerator: 1 });
programSchema.index({ counselors: 1 });
programSchema.index({ moderators: 1 });

// ------------------- MODEL -------------------
const programModel = mongoose.model("Program", programSchema);

export default programModel;
