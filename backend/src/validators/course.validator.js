const { body, param, query } = require('express-validator');

const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Course description is required')
    .isLength({ min: 50, max: 5000 }).withMessage('Description must be between 50 and 5000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  
  body('subcategory')
    .optional()
    .isMongoId().withMessage('Invalid subcategory ID'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all_levels']).withMessage('Invalid level'),
  
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Language cannot exceed 50 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('isFree')
    .optional()
    .isBoolean().withMessage('isFree must be a boolean'),
  
  body('whatYouWillLearn')
    .optional()
    .isArray({ min: 1 }).withMessage('What you will learn must have at least one item'),
  
  body('whatYouWillLearn.*')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Each learning outcome must be between 5 and 200 characters'),
  
  body('requirements')
    .optional()
    .isArray().withMessage('Requirements must be an array'),
  
  body('requirements.*')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Each requirement cannot exceed 200 characters'),
  
  body('targetAudience')
    .optional()
    .isArray().withMessage('Target audience must be an array'),
  
  body('targetAudience.*')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Each target audience item cannot exceed 200 characters'),
  
  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Tags cannot exceed 10 items'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters')
];

const updateCourseValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Subtitle cannot exceed 300 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 }).withMessage('Description must be between 50 and 5000 characters'),
  
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all_levels']).withMessage('Invalid level'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('discountPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discount price must be a positive number')
    .custom((value, { req }) => {
      if (value && req.body.price && value >= req.body.price) {
        throw new Error('Discount price must be less than original price');
      }
      return true;
    }),
  
  body('welcomeMessage')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Welcome message cannot exceed 500 characters'),
  
  body('congratulationsMessage')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Congratulations message cannot exceed 500 characters')
];

const addSectionValidator = [
  body('sectionTitle')
    .trim()
    .notEmpty().withMessage('Section title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Section title must be between 3 and 200 characters'),
  
  body('sectionDescription')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Section description cannot exceed 500 characters')
];

const courseQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  
  query('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'all_levels']).withMessage('Invalid level'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be a positive number'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'popular', 'rating', 'price_low', 'price_high']).withMessage('Invalid sort option'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query cannot exceed 100 characters')
];

const courseApprovalValidator = [
  body('action')
    .notEmpty().withMessage('Action is required')
    .isIn(['approve', 'reject']).withMessage('Action must be approve or reject'),
  
  body('reason')
    .if(body('action').equals('reject'))
    .notEmpty().withMessage('Rejection reason is required')
    .isLength({ min: 10, max: 500 }).withMessage('Reason must be between 10 and 500 characters')
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  addSectionValidator,
  courseQueryValidator,
  courseApprovalValidator
};
