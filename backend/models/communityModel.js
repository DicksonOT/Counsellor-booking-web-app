import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["peer_support", "counselor_led", "wellness_activities", "resource_sharing"],
    required: true 
  },
  theme: {
    type: String,
    enum: ["anxiety", "depression", "stress", "trauma", "mindfulness", "general"],
    default: "general"
  },
  isPrivate: { type: Boolean, default: false },
  maxMembers: { type: Number, default: 100 },
  rules: [{ type: String }],
  moderators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  counselorModerators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Counsellor' 
  }],
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  memberCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  image: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive", "archived"],
    default: "active"
  }
}, { timestamps: true });

// models/postModel.js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  authorType: {
    type: String,
    enum: ["user", "counsellor"],
    default: "user"
  },
  community: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Community',
    required: true 
  },
  postType: {
    type: String,
    enum: ["discussion", "question", "resource", "reflection", "crisis_support"],
    default: "discussion"
  },
  tags: [{ type: String }],
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
  reportCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "hidden", "deleted", "under_review"],
    default: "active"
  },
  moodTag: {
    type: String,
    enum: ["happy", "sad", "anxious", "calm", "frustrated", "hopeful", "overwhelmed"],
    default: null
  },
  supportLevel: {
    type: String,
    enum: ["low", "medium", "high", "crisis"],
    default: "low"
  }
}, { timestamps: true });

// models/commentModel.js
const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  authorType: {
    type: String,
    enum: ["user", "counsellor"],
    default: "user"
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post',
    required: true 
  },
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  likeCount: { type: Number, default: 0 },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],
  replyCount: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
  isSupportive: { type: Boolean, default: false }, // Marked by moderators
  status: {
    type: String,
    enum: ["active", "hidden", "deleted", "under_review"],
    default: "active"
  }
}, { timestamps: true });

// reportModel.js
const reportSchema = new mongoose.Schema({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  reportedContent: {
    contentType: {
      type: String,
      enum: ["post", "comment", "user"],
      required: true
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  reason: {
    type: String,
    enum: ["harassment", "hate_speech", "spam", "inappropriate_content", "crisis_concern", "misinformation", "other"],
    required: true
  },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "dismissed"],
    default: "pending"
  },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  reviewNotes: { type: String },
  actionTaken: {
    type: String,
    enum: ["none", "warning", "content_removed", "user_suspended", "escalated"],
    default: "none"
  }
}, { timestamps: true });

// Export models
const Community = mongoose.model('Community', communitySchema);
const Post =  mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Report = mongoose.model('Report', reportSchema);

export { Community, Post, Comment, Report };