const express = require('express');
const router = express.Router();
const {
  createLesson,
  getLesson,
  updateLesson,
  uploadVideo,
  addResource,
  deleteResource,
  deleteLesson,
  reorderLessons,
  updateProgress,
  markComplete
} = require('../controllers/lesson.controller');
const { authenticate, authorize, requireEnrollment } = require('../middlewares/auth');
const { validate, validateObjectId } = require('../middlewares/validate');
const {
  createLessonValidator,
  updateLessonValidator,
  reorderLessonsValidator,
  addResourceValidator
} = require('../validators/lesson.validator');
const { processUpload } = require('../middlewares/upload');

// All routes require authentication
router.use(authenticate);

// Create lesson (Instructor only)
router.post(
  '/courses/:courseId/lessons',
  authorize('instructor'),
  createLessonValidator,
  validate,
  createLesson
);

// Reorder lessons (Instructor only)
router.put(
  '/courses/:courseId/lessons/reorder',
  authorize('instructor'),
  reorderLessonsValidator,
  validate,
  reorderLessons
);

// Get lesson (Enrolled students or instructor)
router.get('/:id', validateObjectId('id'), getLesson);

// Update lesson (Instructor only)
router.put(
  '/:id',
  authorize('instructor', 'admin'),
  validateObjectId('id'),
  updateLessonValidator,
  validate,
  updateLesson
);

// Upload video (Instructor only)
router.put(
  '/:id/video',
  authorize('instructor'),
  validateObjectId('id'),
  processUpload('video'),
  uploadVideo
);

// Add resource (Instructor only)
router.post(
  '/:id/resources',
  authorize('instructor'),
  validateObjectId('id'),
  processUpload('document'),
  addResourceValidator,
  validate,
  addResource
);

// Delete resource (Instructor only)
router.delete(
  '/:id/resources/:resourceId',
  authorize('instructor'),
  validateObjectId('id'),
  deleteResource
);

// Delete lesson (Instructor only)
router.delete(
  '/:id',
  authorize('instructor', 'admin'),
  validateObjectId('id'),
  deleteLesson
);

// Update progress (Student)
router.put('/:id/progress', validateObjectId('id'), updateProgress);

// Mark complete (Student)
router.put('/:id/complete', validateObjectId('id'), markComplete);

module.exports = router;
