const { body, param, query } = require('express-validator');

const createTestValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Test title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('courseId')
    .notEmpty().withMessage('Course ID is required')
    .isMongoId().withMessage('Invalid course ID'),
  
  body('lessonId')
    .optional()
    .isMongoId().withMessage('Invalid lesson ID'),
  
  body('type')
    .optional()
    .isIn(['practice', 'quiz', 'section_test', 'final_exam', 'mock_test']).withMessage('Invalid test type'),
  
  body('duration')
    .notEmpty().withMessage('Duration is required')
    .isInt({ min: 1, max: 480 }).withMessage('Duration must be between 1 and 480 minutes'),
  
  body('passingMarks')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Passing marks must be between 0 and 100'),
  
  body('negativeMarking.enabled')
    .optional()
    .isBoolean().withMessage('Negative marking enabled must be a boolean'),
  
  body('negativeMarking.percentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Negative marking percentage must be between 0 and 100'),
  
  body('shuffleQuestions')
    .optional()
    .isBoolean().withMessage('Shuffle questions must be a boolean'),
  
  body('shuffleOptions')
    .optional()
    .isBoolean().withMessage('Shuffle options must be a boolean'),
  
  body('attemptLimits.maxAttempts')
    .optional()
    .isInt({ min: -1 }).withMessage('Max attempts must be -1 (unlimited) or positive'),
  
  body('instructions')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Instructions cannot exceed 2000 characters'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'mixed']).withMessage('Invalid difficulty level')
];

const updateTestValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 480 }).withMessage('Duration must be between 1 and 480 minutes'),
  
  body('passingMarks')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Passing marks must be between 0 and 100'),
  
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean')
];

const createQuestionValidator = [
  body('type')
    .notEmpty().withMessage('Question type is required')
    .isIn(['mcq', 'true_false', 'multiple_select', 'fill_blank', 'short_answer']).withMessage('Invalid question type'),
  
  body('question')
    .trim()
    .notEmpty().withMessage('Question text is required')
    .isLength({ min: 5, max: 2000 }).withMessage('Question must be between 5 and 2000 characters'),
  
  body('options')
    .if(body('type').isIn(['mcq', 'true_false', 'multiple_select']))
    .isArray({ min: 2, max: 6 }).withMessage('Options must have between 2 and 6 items'),
  
  body('options.*.text')
    .if(body('type').isIn(['mcq', 'true_false', 'multiple_select']))
    .notEmpty().withMessage('Option text is required')
    .isLength({ max: 500 }).withMessage('Option text cannot exceed 500 characters'),
  
  body('correctAnswer')
    .notEmpty().withMessage('Correct answer is required'),
  
  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Explanation cannot exceed 2000 characters'),
  
  body('marks')
    .optional()
    .isFloat({ min: 0 }).withMessage('Marks must be a positive number'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  
  body('topic')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Topic cannot exceed 100 characters'),
  
  body('hint')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Hint cannot exceed 500 characters')
];

const submitTestValidator = [
  body('answers')
    .isArray().withMessage('Answers must be an array'),
  
  body('answers.*.questionId')
    .notEmpty().withMessage('Question ID is required')
    .isMongoId().withMessage('Invalid question ID'),
  
  body('answers.*.selectedAnswer')
    .exists().withMessage('Selected answer is required (can be null for unanswered)'),
  
  body('timeTaken')
    .optional()
    .isInt({ min: 0 }).withMessage('Time taken must be a non-negative integer')
];

module.exports = {
  createTestValidator,
  updateTestValidator,
  createQuestionValidator,
  submitTestValidator
};
