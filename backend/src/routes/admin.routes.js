const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  getInstructors,
  getAuditLogs,
  getAnalytics,
  sendAnnouncement
} = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin', 'admin_helper'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', validateObjectId('id'), getUserDetails);
router.put('/users/:id/status', validateObjectId('id'), updateUserStatus);
router.delete('/users/:id', authorize('admin'), validateObjectId('id'), deleteUser);

// Instructor management
router.get('/instructors', getInstructors);

// Analytics
router.get('/analytics', getAnalytics);

// Audit logs
router.get('/audit-logs', getAuditLogs);

// Announcements
router.post('/announcements', authorize('admin'), sendAnnouncement);

module.exports = router;
