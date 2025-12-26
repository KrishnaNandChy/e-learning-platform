const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { buildPaginationInfo } = require('../utils/helpers');

/**
 * @desc    Get user's notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
const getNotifications = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, unreadOnly = false, type } = req.query;

  const query = { user: req.user._id };
  
  if (unreadOnly === 'true') {
    query.isRead = false;
  }
  
  if (type) {
    query.type = type;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments(query),
    Notification.getUnreadCount(req.user._id)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, { notifications, unreadCount }, pagination);
});

/**
 * @desc    Get unread count
 * @route   GET /api/v1/notifications/unread-count
 * @access  Private
 */
const getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.getUnreadCount(req.user._id);
  return ApiResponse.success(res, { unreadCount: count });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!notification) {
    return next(ApiError.notFound('Notification not found'));
  }

  await notification.markAsRead();

  return ApiResponse.success(res, { notification }, 'Notification marked as read');
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/v1/notifications/read-all
 * @access  Private
 */
const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.markAllAsRead(req.user._id);
  return ApiResponse.success(res, null, 'All notifications marked as read');
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!notification) {
    return next(ApiError.notFound('Notification not found'));
  }

  return ApiResponse.success(res, null, 'Notification deleted');
});

/**
 * @desc    Delete all notifications
 * @route   DELETE /api/v1/notifications/clear-all
 * @access  Private
 */
const clearAllNotifications = asyncHandler(async (req, res, next) => {
  await Notification.deleteMany({ user: req.user._id });
  return ApiResponse.success(res, null, 'All notifications cleared');
});

/**
 * @desc    Update notification preferences
 * @route   PUT /api/v1/notifications/preferences
 * @access  Private
 */
const updatePreferences = asyncHandler(async (req, res, next) => {
  const { emailNotifications, inAppNotifications, newsletter } = req.body;

  const User = require('../models/User');
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      'preferences.emailNotifications': emailNotifications,
      'preferences.inAppNotifications': inAppNotifications,
      'preferences.newsletter': newsletter
    },
    { new: true }
  );

  return ApiResponse.success(res, { preferences: user.preferences }, 'Preferences updated');
});

/**
 * @desc    Create notification (Internal use / Admin)
 * @route   POST /api/v1/notifications
 * @access  Private/Admin
 */
const createNotification = asyncHandler(async (req, res, next) => {
  const { userId, type, title, message, data } = req.body;

  const notification = await Notification.createNotification(
    userId,
    type,
    title,
    message,
    data
  );

  return ApiResponse.created(res, { notification }, 'Notification created');
});

/**
 * @desc    Send bulk notification (Admin)
 * @route   POST /api/v1/notifications/bulk
 * @access  Private/Admin
 */
const sendBulkNotification = asyncHandler(async (req, res, next) => {
  const { userIds, type, title, message, data, sendToAll } = req.body;

  let targetUsers = userIds;

  if (sendToAll) {
    const User = require('../models/User');
    const users = await User.find({ isActive: true }).select('_id');
    targetUsers = users.map(u => u._id);
  }

  const notifications = await Promise.all(
    targetUsers.map(userId => 
      Notification.createNotification(userId, type, title, message, data)
    )
  );

  return ApiResponse.success(res, {
    count: notifications.length
  }, `Sent ${notifications.length} notifications`);
});

/**
 * @desc    Get notification types
 * @route   GET /api/v1/notifications/types
 * @access  Private
 */
const getNotificationTypes = asyncHandler(async (req, res, next) => {
  const types = [
    { value: 'enrollment', label: 'Enrollment', icon: '📚' },
    { value: 'course_update', label: 'Course Updates', icon: '📝' },
    { value: 'lesson_added', label: 'New Lessons', icon: '🎬' },
    { value: 'doubt_reply', label: 'Doubt Replies', icon: '💬' },
    { value: 'doubt_resolved', label: 'Doubts Resolved', icon: '✅' },
    { value: 'test_result', label: 'Test Results', icon: '📊' },
    { value: 'certificate_ready', label: 'Certificates', icon: '🏆' },
    { value: 'payment_success', label: 'Payments', icon: '💳' },
    { value: 'announcement', label: 'Announcements', icon: '📢' },
    { value: 'reminder', label: 'Reminders', icon: '⏰' },
    { value: 'system', label: 'System', icon: '⚙️' },
    { value: 'promotion', label: 'Promotions', icon: '🎉' }
  ];

  return ApiResponse.success(res, { types });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  updatePreferences,
  createNotification,
  sendBulkNotification,
  getNotificationTypes
};
