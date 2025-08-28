import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number, // Duration in minutes
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

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 200 },
  description: { type: String, required: true, maxLength: 1000 },
  shortDescription: { type: String, maxLength: 300 }, // For cards/previews
  
  // Duration and difficulty
  duration: { 
    value: { type: Number, required: true }, // Duration in days
    unit: { type: String, enum: ['days', 'weeks', 'months'], default: 'days' }
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
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
      'Exercise & Movement',
      'Personal Growth'
    ], 
    required: true 
  },
  tags: [{ type: String, trim: true }],
  
  // Instructor information
  instructor: {
    name: { type: String, required: true },
    title: String,
    bio: String,
    image: String,
    credentials: [String]
  },
  
  // Program structure
  modules: [moduleSchema],
  totalModules: { type: Number, default: 0 },
  
  // Engagement metrics
  rating: { 
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 }
  },
  participants: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 }, // Percentage
  
  // Content
  thumbnail: { type: String, required: true },
  images: [String],
  videoTrailer: String,
  
  // Program details
  outcome: { type: String, required: true },
  whatYouWillLearn: [String],
  prerequisites: [String],
  features: [String],
  
  // Pricing and access
  price: { 
    type: String, 
    enum: ["Free", "Premium"], 
    default: "Free" 
  },
  premiumPrice: Number, // Price in cents for premium programs
  
  // Program status and availability
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: { type: Boolean, default: true },
  publishedAt: Date,
  
  // Wellness tracking
  targetAudience: [String], // e.g., ["Anxiety sufferers", "New parents"]
  healthConditions: [String], // Related health conditions this helps with
  mentalHealthAreas: [String], // Specific areas of mental health this addresses
  
  // Engagement and community
  allowDiscussion: { type: Boolean, default: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  
  // Progress tracking
  progressTrackingEnabled: { type: Boolean, default: true },
  certificateEnabled: { type: Boolean, default: false },
  pointsReward: { type: Number, default: 50 }, // Points awarded for completion
  
  // Reviews and feedback
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxLength: 500 },
    isVerified: { type: Boolean, default: false }, // Verified completion
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    enrollments: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    avgTimeToComplete: Number, // Average completion time in days
    monthlyEnrollments: [{
      month: Number,
      year: Number,
      count: Number
    }]
  },
  
  // SEO and metadata
  slug: { type: String, unique: true },
  metaDescription: String,
  keywords: [String]
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion percentage
programSchema.virtual('completionPercentage').get(function() {
  if (this.analytics.enrollments === 0) return 0;
  return Math.round((this.analytics.completions / this.analytics.enrollments) * 100);
});

// Virtual for average rating
programSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

// Pre-save middleware to generate slug
programSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Update total modules count
  if (this.modules) {
    this.totalModules = this.modules.length;
  }
  
  next();
});

// Index for search and filtering
programSchema.index({ title: 'text', description: 'text', tags: 'text' });
programSchema.index({ category: 1, difficulty: 1 });
programSchema.index({ 'rating.average': -1 });
programSchema.index({ participants: -1 });
programSchema.index({ createdAt: -1 });
programSchema.index({ slug: 1 });

const programModel = mongoose.model("Program", programSchema);

export default programModel;