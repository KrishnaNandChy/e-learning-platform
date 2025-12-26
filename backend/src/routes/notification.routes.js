const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/notification.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.get('/types', getNotificationTypes);
router.put('/read-all', markAllAsRead);
router.put('/preferences', updatePreferences);
router.delete('/clear-all', clearAllNotifications);
router.put('/:id/read', validateObjectId('id'), markAsRead);
router.delete('/:id', validateObjectId('id'), deleteNotification);

// Admin routes
router.post('/', authorize('admin', 'admin_helper'), createNotification);
router.post('/bulk', authorize('admin'), sendBulkNotification);

module.exports = router;
