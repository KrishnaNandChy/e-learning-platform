const express = require('express');
const router = express.Router();
const {
  getMyEnrollments,
  getEnrollment,
  enrollFree,
  updateEnrollment,
  removeBookmark,
  getCourseStudents,
  getEnrollmentAnalytics,
  processRefund
} = require('../controllers/enrollment.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// All routes require authentication
router.use(authenticate);

// Student routes
router.get('/', getMyEnrollments);
router.get('/:courseId', validateObjectId('courseId'), getEnrollment);
router.post('/free/:courseId', validateObjectId('courseId'), enrollFree);
router.put('/:courseId', validateObjectId('courseId'), updateEnrollment);
router.delete('/:courseId/bookmarks/:bookmarkId', validateObjectId('courseId'), removeBookmark);

// Instructor routes
router.get(
  '/course/:courseId/students',
  authorize('instructor', 'admin', 'admin_helper'),
  validateObjectId('courseId'),
  getCourseStudents
);

router.get(
  '/course/:courseId/analytics',
  authorize('instructor', 'admin', 'admin_helper'),
  validateObjectId('courseId'),
  getEnrollmentAnalytics
);

// Admin routes
router.post(
  '/:enrollmentId/refund',
  authorize('admin'),
  validateObjectId('enrollmentId'),
  processRefund
);

module.exports = router;
