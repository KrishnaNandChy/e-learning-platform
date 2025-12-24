const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllCourses,
  toggleFeatured,
  sendNotification,
  createAdmin,
} = require('../controllers/admin.controller');

// All routes require admin role
router.use(protect);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Course management
router.get('/courses', getAllCourses);
router.put('/courses/:id/feature', toggleFeatured);

// Notifications
router.post('/notifications', sendNotification);

// Admin creation
router.post('/create-admin', createAdmin);

module.exports = router;
