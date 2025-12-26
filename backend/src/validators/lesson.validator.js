const { body, param } = require('express-validator');

const createLessonValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Lesson title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('sectionIndex')
    .notEmpty().withMessage('Section index is required')
    .isInt({ min: 0 }).withMessage('Section index must be a non-negative integer'),
  
  body('type')
    .optional()
    .isIn(['video', 'text', 'quiz', 'assignment', 'resource']).withMessage('Invalid lesson type'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('content.text')
    .optional()
    .trim()
    .isLength({ max: 50000 }).withMessage('Text content cannot exceed 50000 characters'),
  
  body('isFreePreview')
    .optional()
    .isBoolean().withMessage('isFreePreview must be a boolean'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Notes cannot exceed 5000 characters')
];

const updateLessonValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  
  body('type')
    .optional()
    .isIn(['video', 'text', 'quiz', 'assignment', 'resource']).withMessage('Invalid lesson type'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('content.text')
    .optional()
    .trim()
    .isLength({ max: 50000 }).withMessage('Text content cannot exceed 50000 characters'),
  
  body('isFreePreview')
    .optional()
    .isBoolean().withMessage('isFreePreview must be a boolean'),
  
  body('isPublished')
    .optional()
    .isBoolean().withMessage('isPublished must be a boolean'),
  
  body('minimumWatchPercentage')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Minimum watch percentage must be between 0 and 100')
];

const reorderLessonsValidator = [
  body('lessons')
    .isArray({ min: 1 }).withMessage('Lessons array is required'),
  
  body('lessons.*.lessonId')
    .notEmpty().withMessage('Lesson ID is required')
    .isMongoId().withMessage('Invalid lesson ID'),
  
  body('lessons.*.sectionIndex')
    .notEmpty().withMessage('Section index is required')
    .isInt({ min: 0 }).withMessage('Section index must be a non-negative integer'),
  
  body('lessons.*.order')
    .notEmpty().withMessage('Order is required')
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer')
];

const addResourceValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Resource title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  
  body('type')
    .optional()
    .isIn(['pdf', 'ppt', 'doc', 'zip', 'link', 'other']).withMessage('Invalid resource type'),
  
  body('url')
    .optional()
    .isURL().withMessage('Please provide a valid URL'),
  
  body('downloadable')
    .optional()
    .isBoolean().withMessage('Downloadable must be a boolean')
];

module.exports = {
  createLessonValidator,
  updateLessonValidator,
  reorderLessonsValidator,
  addResourceValidator
};
