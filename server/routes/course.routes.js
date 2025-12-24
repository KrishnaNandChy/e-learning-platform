const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const {
  getCourses,
  getCourseById,
  getFeaturedCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  enrollCourse,
  getEnrolledCourses,
  getInstructorCourses,
  updateProgress,
  toggleWishlist,
} = require('../controllers/course.controller');

const { getCourseReviews, addReview } = require('../controllers/review.controller');

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:id', getCourseById);
router.get('/:courseId/reviews', getCourseReviews);

// Protected routes - Student
router.get('/user/enrolled', protect, getEnrolledCourses);
router.post('/:id/enroll', protect, enrollCourse);
router.put('/:id/progress', protect, updateProgress);
router.post('/:id/wishlist', protect, toggleWishlist);
router.post('/:courseId/reviews', protect, addReview);

// Protected routes - Instructor
router.get('/instructor/my-courses', protect, authorizeRoles('instructor', 'admin'), getInstructorCourses);
router.post('/', protect, authorizeRoles('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorizeRoles('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorizeRoles('instructor', 'admin'), deleteCourse);
router.put('/:id/publish', protect, authorizeRoles('instructor', 'admin'), publishCourse);

module.exports = router;
