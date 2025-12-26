const mongoose = require('mongoose');

const doubtReplySchema = new mongoose.Schema({
  responder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    maxlength: [5000, 'Reply cannot exceed 5000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link']
    },
    url: String,
    public_id: String,
    name: String
  }],
  isInstructorReply: {
    type: Boolean,
    default: false
  },
  isAdminReply: {
    type: Boolean,
    default: false
  },
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});

const doubtSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Doubt title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Doubt description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link']
    },
    url: String,
    public_id: String,
    name: String
  }],
  videoTimestamp: {
    type: Number // Timestamp in video where doubt arose
  },
  status: {
    type: String,
    enum: ['open', 'answered', 'closed', 'flagged'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['concept', 'technical', 'assignment', 'other'],
    default: 'concept'
  },
  replies: [doubtReplySchema],
  totalReplies: {
    type: Number,
    default: 0
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
doubtSchema.index({ user: 1 });
doubtSchema.index({ course: 1 });
doubtSchema.index({ lesson: 1 });
doubtSchema.index({ status: 1 });
doubtSchema.index({ createdAt: -1 });
doubtSchema.index({ title: 'text', description: 'text' });

// Update reply count
doubtSchema.pre('save', function(next) {
  this.totalReplies = this.replies.length;
  next();
});

// Add a reply
doubtSchema.methods.addReply = async function(responder, content, attachments, isInstructor, isAdmin) {
  this.replies.push({
    responder: responder._id,
    content,
    attachments,
    isInstructorReply: isInstructor,
    isAdminReply: isAdmin
  });
  
  // Update status if instructor/admin replied
  if (isInstructor || isAdmin) {
    this.status = 'answered';
  }
  
  await this.save();
  return this;
};

// Mark as resolved
doubtSchema.methods.markResolved = async function(userId) {
  this.isResolved = true;
  this.resolvedAt = new Date();
  this.resolvedBy = userId;
  this.status = 'closed';
  await this.save();
  return this;
};

const Doubt = mongoose.model('Doubt', doubtSchema);

module.exports = Doubt;
