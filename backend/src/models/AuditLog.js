const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Auth actions
      'user_registered',
      'user_logged_in',
      'user_logged_out',
      'password_changed',
      'password_reset_requested',
      'password_reset_completed',
      'email_verified',
      
      // User management
      'user_created',
      'user_updated',
      'user_deleted',
      'user_suspended',
      'user_activated',
      'instructor_created',
      'instructor_approved',
      'instructor_suspended',
      
      // Course actions
      'course_created',
      'course_updated',
      'course_published',
      'course_unpublished',
      'course_deleted',
      'course_approved',
      'course_rejected',
      'lesson_created',
      'lesson_updated',
      'lesson_deleted',
      
      // Enrollment actions
      'enrollment_created',
      'enrollment_completed',
      'enrollment_refunded',
      
      // Payment actions
      'payment_initiated',
      'payment_completed',
      'payment_failed',
      'refund_initiated',
      'refund_completed',
      
      // Certificate actions
      'certificate_generated',
      'certificate_revoked',
      'certificate_downloaded',
      
      // Admin actions
      'settings_updated',
      'category_created',
      'category_updated',
      'category_deleted',
      'announcement_created',
      
      // Other
      'doubt_created',
      'doubt_answered',
      'test_created',
      'test_submitted',
      'report_generated',
      'data_exported',
      'bulk_action_performed'
    ]
  },
  category: {
    type: String,
    enum: ['auth', 'user', 'course', 'payment', 'admin', 'system'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['user', 'course', 'lesson', 'enrollment', 'payment', 'certificate', 'doubt', 'test', 'category', 'settings', 'other']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  previousData: {
    type: mongoose.Schema.Types.Mixed
  },
  newData: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  location: {
    country: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  errorMessage: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ category: 1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ ipAddress: 1 });

// Static method to create audit log
auditLogSchema.statics.log = async function(data) {
  try {
    const log = await this.create({
      user: data.userId,
      action: data.action,
      category: data.category,
      description: data.description,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      previousData: data.previousData,
      newData: data.newData,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: data.status || 'success',
      errorMessage: data.errorMessage,
      metadata: data.metadata
    });
    return log;
  } catch (error) {
    console.error('Audit log creation failed:', error);
    return null;
  }
};

// Get logs by user
auditLogSchema.statics.getByUser = async function(userId, options = {}) {
  const { page = 1, limit = 20, action, category, startDate, endDate } = options;
  
  const query = { user: userId };
  
  if (action) query.action = action;
  if (category) query.category = category;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name email role');
};

// Get logs by resource
auditLogSchema.statics.getByResource = async function(resourceType, resourceId, options = {}) {
  const { page = 1, limit = 20 } = options;
  
  return await this.find({ resourceType, resourceId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name email role');
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
