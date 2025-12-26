const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'enrollment',
      'course_update',
      'lesson_added',
      'doubt_reply',
      'doubt_resolved',
      'test_result',
      'certificate_ready',
      'payment_success',
      'payment_failed',
      'refund_processed',
      'announcement',
      'reminder',
      'system',
      'promotion',
      'review_response',
      'course_approved',
      'course_rejected',
      'account_update'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  data: {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    doubtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doubt'
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    link: String,
    extra: mongoose.Schema.Types.Mixed
  },
  icon: {
    type: String
  },
  image: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isEmail: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  isPush: {
    type: Boolean,
    default: false
  },
  pushSentAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiresAt: Date,
  actionUrl: String,
  actionText: String
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark as read
notificationSchema.methods.markAsRead = async function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
  }
  return this;
};

// Static method to create notification
notificationSchema.statics.createNotification = async function(userId, type, title, message, data = {}) {
  const notification = await this.create({
    user: userId,
    type,
    title,
    message,
    data,
    icon: getNotificationIcon(type),
    actionUrl: data.link,
    actionText: getActionText(type)
  });
  
  return notification;
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

// Helper function to get notification icon
function getNotificationIcon(type) {
  const icons = {
    enrollment: '📚',
    course_update: '📝',
    lesson_added: '🎬',
    doubt_reply: '💬',
    doubt_resolved: '✅',
    test_result: '📊',
    certificate_ready: '🏆',
    payment_success: '💳',
    payment_failed: '❌',
    refund_processed: '💰',
    announcement: '📢',
    reminder: '⏰',
    system: '⚙️',
    promotion: '🎉',
    review_response: '⭐',
    course_approved: '✅',
    course_rejected: '❌',
    account_update: '👤'
  };
  return icons[type] || '🔔';
}

// Helper function to get action text
function getActionText(type) {
  const texts = {
    enrollment: 'Start Learning',
    course_update: 'View Course',
    lesson_added: 'Watch Now',
    doubt_reply: 'View Reply',
    doubt_resolved: 'View Solution',
    test_result: 'View Results',
    certificate_ready: 'Download Certificate',
    payment_success: 'View Order',
    announcement: 'Read More',
    reminder: 'Continue Learning'
  };
  return texts[type] || 'View';
}

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
