const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  uploadThumbnail,
  uploadPromoVideo,
  addSection,
  updateSection,
  deleteSection,
  submitForReview,
  approveCourse,
  deleteCourse,
  getInstructorCourses,
  getPendingCourses,
  toggleFeatured
} = require('../controllers/course.controller');
const { authenticate, optionalAuth, authorize } = require('../middlewares/auth');
const { validate, validateObjectId } = require('../middlewares/validate');
const {
  createCourseValidator,
  updateCourseValidator,
  addSectionValidator,
  courseQueryValidator,
  courseApprovalValidator
} = require('../validators/course.validator');
const { processUpload } = require('../middlewares/upload');

// Public routes
router.get('/', courseQueryValidator, validate, optionalAuth, getCourses);
router.get('/:slug', optionalAuth, getCourse);

// Protected routes - require authentication
router.use(authenticate);

// Instructor routes
router.get('/instructor/my-courses', authorize('instructor'), getInstructorCourses);
router.post('/', authorize('instructor'), createCourseValidator, validate, createCourse);
router.put('/:id', authorize('instructor', 'admin'), validateObjectId('id'), updateCourseValidator, validate, updateCourse);
router.put('/:id/thumbnail', authorize('instructor', 'admin'), validateObjectId('id'), processUpload('thumbnail'), uploadThumbnail);
router.put('/:id/promo-video', authorize('instructor', 'admin'), validateObjectId('id'), processUpload('video'), uploadPromoVideo);
router.post('/:id/sections', authorize('instructor'), validateObjectId('id'), addSectionValidator, validate, addSection);
router.put('/:id/sections/:sectionIndex', authorize('instructor'), validateObjectId('id'), updateSection);
router.delete('/:id/sections/:sectionIndex', authorize('instructor'), validateObjectId('id'), deleteSection);
router.put('/:id/submit', authorize('instructor'), validateObjectId('id'), submitForReview);
router.delete('/:id', authorize('instructor', 'admin'), validateObjectId('id'), deleteCourse);

// Admin routes
router.get('/admin/pending', authorize('admin', 'admin_helper'), getPendingCourses);
router.put('/:id/approval', authorize('admin', 'admin_helper'), validateObjectId('id'), courseApprovalValidator, validate, approveCourse);
router.put('/:id/featured', authorize('admin'), validateObjectId('id'), toggleFeatured);

module.exports = router;
