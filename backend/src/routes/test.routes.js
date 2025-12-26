const express = require('express');
const router = express.Router();
const {
  createTest,
  getCourseTests,
  getTest,
  updateTest,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  startTest,
  submitTest,
  getTestResult,
  getLeaderboard,
  deleteTest
} = require('../controllers/test.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, validateObjectId } = require('../middlewares/validate');
const {
  createTestValidator,
  updateTestValidator,
  createQuestionValidator,
  submitTestValidator
} = require('../validators/test.validator');

// All routes require authentication
router.use(authenticate);

// Instructor routes
router.post('/', authorize('instructor'), createTestValidator, validate, createTest);
router.put('/:id', authorize('instructor', 'admin'), validateObjectId('id'), updateTestValidator, validate, updateTest);
router.delete('/:id', authorize('instructor', 'admin'), validateObjectId('id'), deleteTest);

// Question management (Instructor only)
router.post('/:id/questions', authorize('instructor'), validateObjectId('id'), createQuestionValidator, validate, addQuestion);
router.put('/:testId/questions/:questionId', authorize('instructor'), updateQuestion);
router.delete('/:testId/questions/:questionId', authorize('instructor'), deleteQuestion);

// Student routes
router.get('/course/:courseId', validateObjectId('courseId'), getCourseTests);
router.get('/:id', validateObjectId('id'), getTest);
router.post('/:id/start', validateObjectId('id'), startTest);
router.post('/:id/submit', validateObjectId('id'), submitTestValidator, validate, submitTest);
router.get('/:testId/results/:resultId', getTestResult);
router.get('/:id/leaderboard', validateObjectId('id'), getLeaderboard);

module.exports = router;
