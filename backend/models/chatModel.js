import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: function() {
      return this.messageType !== 'system';
    }
  },
  senderRole: {
    type: String,
    enum: ['user', 'participant', 'counselor', 'moderator', 'admin', 'system'],
    required: true
  },
  content: { 
    type: String, 
    required: true,
    maxLength: 1000 
  },
  messageType: {
    type: String,
    enum: ['text', 'system', 'session_start', 'session_end', 'announcement', 'welcome'],
    default: 'text'
  },
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  originalContent: String, // Store original content when edited
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emoji: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Message status tracking
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'pending', 'failed'],
    default: 'sent'
  },
  
  // Moderation fields
  isModerated: { type: Boolean, default: false },
  moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  moderatedAt: Date,
  moderationReason: String,
  
  // Threading support (for replies)
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  threadId: String,
  
  // Mentions
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  // Attachments (if needed later)
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'link', 'emoji']
    },
    url: String,
    name: String,
    size: Number
  }]
}, { 
  timestamps: true 
});

const chatRoomSchema = new mongoose.Schema({
  program: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Program", 
    required: true,
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  
  // Enhanced moderation with more granular roles
  moderators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // Primary moderators
  }],
  counselors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // Licensed counselors
  }],
  admins: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // System administrators
  }],
  
  // Members (enrolled users) with enhanced tracking
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      enum: ['participant', 'counselor', 'moderator', 'admin'],
      default: 'participant'
    },
    joinedAt: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now },
    isOnline: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    mutedUntil: Date,
    mutedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    warnings: { type: Number, default: 0 },
    warningHistory: [{
      reason: String,
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      issuedAt: { type: Date, default: Date.now }
    }],
    permissions: {
      canSendMessages: { type: Boolean, default: true },
      canReact: { type: Boolean, default: true },
      canMention: { type: Boolean, default: true }
    }
  }],
  
  // Messages with pagination support
  messages: [messageSchema],
  messageCount: { type: Number, default: 0 },
  
  // Enhanced last message tracking
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderName: String,
    senderRole: String,
    timestamp: Date,
    messageType: String
  },
  
  // Session management for guided discussions
  activeSession: {
    isActive: { type: Boolean, default: false },
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startedAt: Date,
    endedAt: Date,
    title: String,
    agenda: String,
    topic: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notes: String
  },
  
  // Scheduled sessions
  scheduledSessions: [{
    title: String,
    description: String,
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: Date,
    duration: Number, // in minutes
    topic: String,
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: String, // daily, weekly, monthly
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ['scheduled', 'active', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  
  // Enhanced room settings
  settings: {
    // Message settings
    allowUserMessages: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    maxMessageLength: { type: Number, default: 1000 },
    allowReactions: { type: Boolean, default: true },
    allowMentions: { type: Boolean, default: true },
    allowThreads: { type: Boolean, default: false },
    
    // Moderation settings
    autoModeration: { type: Boolean, default: false },
    profanityFilter: { type: Boolean, default: true },
    spamProtection: { type: Boolean, default: true },
    slowMode: { 
      enabled: { type: Boolean, default: false },
      interval: { type: Number, default: 30 } // seconds between messages
    },
    
    // Privacy and safety
    allowAnonymousMessages: { type: Boolean, default: false },
    requireMemberApproval: { type: Boolean, default: true },
    hideOfflineMembers: { type: Boolean, default: false },
    
    // Session settings
    sessionSchedule: String,
    allowUserSessions: { type: Boolean, default: false },
    maxSessionDuration: { type: Number, default: 120 }, // minutes
    
    // Notification settings
    mentionNotifications: { type: Boolean, default: true },
    sessionNotifications: { type: Boolean, default: true },
    newMemberNotifications: { type: Boolean, default: true }
  },
  
  // Enhanced statistics and analytics
  stats: {
    totalMessages: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    onlineMembers: { type: Number, default: 0 },
    lastActivity: Date,
    
    // Engagement metrics
    avgMessagesPerDay: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    
    // Safety metrics
    totalWarnings: { type: Number, default: 0 },
    totalModerations: { type: Number, default: 0 },
    
    // Daily activity tracking
    dailyStats: [{
      date: { type: Date, required: true },
      messages: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      newMembers: { type: Number, default: 0 }
    }]
  },
  
  // Room status
  status: {
    type: String,
    enum: ['active', 'paused', 'archived', 'maintenance'],
    default: 'active'
  },
  
  // Crisis management
  crisisMode: {
    isActive: { type: Boolean, default: false },
    activatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    activatedAt: Date,
    reason: String,
    restrictedToModerators: { type: Boolean, default: false }
  },
  
  // Archive settings
  archiveSettings: {
    autoArchive: { type: Boolean, default: false },
    archiveAfterDays: { type: Number, default: 90 },
    keepMessagesOnArchive: { type: Boolean, default: true }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for computed properties
chatRoomSchema.virtual('onlineMembersList').get(function() {
  return this.members.filter(member => member.isOnline);
});

chatRoomSchema.virtual('counselorsList').get(function() {
  return this.members.filter(member => 
    ['counselor', 'moderator', 'admin'].includes(member.role)
  );
});

chatRoomSchema.virtual('participantsList').get(function() {
  return this.members.filter(member => member.role === 'participant');
});

// Indexes for performance
chatRoomSchema.index({ program: 1 });
chatRoomSchema.index({ 'members.user': 1 });
chatRoomSchema.index({ 'messages.sender': 1 });
chatRoomSchema.index({ 'messages.createdAt': -1 });
chatRoomSchema.index({ 'lastMessage.timestamp': -1 });
chatRoomSchema.index({ status: 1 });
chatRoomSchema.index({ 'stats.lastActivity': -1 });

// Pre-save middleware to update stats and last message
chatRoomSchema.pre('save', function(next) {
  // Update message count
  if (this.isModified('messages')) {
    this.messageCount = this.messages.length;
    this.stats.totalMessages = this.messages.length;
    this.stats.lastActivity = new Date();
    
    // Update last message
    if (this.messages.length > 0) {
      const lastMsg = this.messages[this.messages.length - 1];
      this.lastMessage = {
        content: lastMsg.content,
        sender: lastMsg.sender,
        senderRole: lastMsg.senderRole,
        timestamp: lastMsg.createdAt || new Date(),
        messageType: lastMsg.messageType
      };
    }
  }
  
  // Update member counts
  if (this.isModified('members')) {
    this.stats.totalMembers = this.members.length;
    this.stats.activeMembers = this.members.filter(m => 
      m.lastSeen && (Date.now() - m.lastSeen.getTime()) < 24 * 60 * 60 * 1000
    ).length;
    this.stats.onlineMembers = this.members.filter(m => m.isOnline).length;
  }
  
  next();
});


// Method to update member online status
chatRoomSchema.methods.updateMemberStatus = async function(userId, isOnline) {
  const member = this.members.find(m => m.user.toString() === userId.toString());
  
  if (member) {
    member.isOnline = isOnline;
    member.lastSeen = new Date();
    await this.save();
  }
  
  return this;
};

// Method to send a message
chatRoomSchema.methods.sendMessage = async function(senderId, content, messageType = 'text', senderRole = 'participant') {
  // Check if user is muted
  const member = this.members.find(m => m.user.toString() === senderId.toString());
  
  if (member && member.isMuted && member.mutedUntil && member.mutedUntil > new Date()) {
    throw new Error('User is muted');
  }
  
  // Check slow mode
  if (this.settings.slowMode.enabled && senderRole === 'participant') {
    const lastMessage = this.messages
      .filter(m => m.sender && m.sender.toString() === senderId.toString())
      .pop();
      
    if (lastMessage && (Date.now() - lastMessage.createdAt.getTime()) < (this.settings.slowMode.interval * 1000)) {
      throw new Error('Slow mode active - please wait before sending another message');
    }
  }
  
  // Add the message
  const message = {
    sender: senderId,
    senderRole: senderRole,
    content: content,
    messageType: messageType,
    status: 'sent'
  };
  
  this.messages.push(message);
  await this.save();
  
  return this.messages[this.messages.length - 1];
};

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;