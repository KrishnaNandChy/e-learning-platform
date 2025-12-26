const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Validation middleware that checks for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    
    return next(ApiError.validation(formattedErrors));
  }
  
  next();
};

/**
 * Sanitize request body
 */
const sanitize = (req, res, next) => {
  // Remove any HTML tags from string fields
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/<[^>]*>/g, '').trim();
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };
  
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  next();
};

/**
 * Validate MongoDB ObjectId parameter
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return next(ApiError.badRequest(`${paramName} is required`));
    }
    
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return next(ApiError.badRequest(`Invalid ${paramName} format`));
    }
    
    next();
  };
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  let { page, limit, sort, order } = req.query;
  
  // Parse and validate page
  page = parseInt(page) || 1;
  if (page < 1) page = 1;
  
  // Parse and validate limit
  limit = parseInt(limit) || 10;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;
  
  // Validate sort order
  order = order === 'asc' ? 1 : -1;
  
  // Attach to request
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: sort || 'createdAt',
    order
  };
  
  next();
};

/**
 * Validate file upload
 */
const validateFile = (options = {}) => {
  const {
    required = false,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  } = options;
  
  return (req, res, next) => {
    const file = req.file;
    
    if (!file && required) {
      return next(ApiError.badRequest('File is required'));
    }
    
    if (file) {
      if (file.size > maxSize) {
        return next(ApiError.badRequest(`File size exceeds maximum allowed (${Math.round(maxSize / 1024 / 1024)}MB)`));
      }
      
      if (!allowedTypes.includes(file.mimetype)) {
        return next(ApiError.badRequest(`File type ${file.mimetype} is not allowed`));
      }
    }
    
    next();
  };
};

module.exports = {
  validate,
  sanitize,
  validateObjectId,
  validatePagination,
  validateFile
};
