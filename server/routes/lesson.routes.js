const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require('../controllers/lesson.controller');

// Get lessons for a course (public - limited data)
router.get('/:courseId', getLessonsByCourse);

// Get single lesson (protected)
router.get('/single/:id', protect, getLessonById);

// Create lesson (instructor/admin)
router.post('/:courseId', protect, authorizeRoles('instructor', 'admin'), createLesson);

// Update lesson (instructor/admin)
router.put('/:id', protect, authorizeRoles('instructor', 'admin'), updateLesson);

// Delete lesson (instructor/admin)
router.delete('/:id', protect, authorizeRoles('instructor', 'admin'), deleteLesson);

module.exports = router;
