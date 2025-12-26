const crypto = require('crypto');
const slugify = require('slugify');

/**
 * Generate a random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a unique ID
 */
const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex');
  return prefix ? `${prefix}-${timestamp}-${randomStr}` : `${timestamp}-${randomStr}`;
};

/**
 * Generate a slug from text
 */
const generateSlug = (text, options = {}) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    ...options
  });
};

/**
 * Generate a temporary password
 */
const generateTempPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Calculate percentage
 */
const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format duration from seconds to readable format
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

/**
 * Paginate array
 */
const paginateArray = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = array.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Build pagination info for mongoose queries
 */
const buildPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

/**
 * Parse query string to MongoDB filter
 */
const parseQueryFilters = (query, allowedFields = []) => {
  const filters = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (allowedFields.includes(key) && value !== undefined && value !== '') {
      // Handle comparison operators
      if (typeof value === 'object') {
        if (value.gt) filters[key] = { $gt: value.gt };
        if (value.gte) filters[key] = { ...filters[key], $gte: value.gte };
        if (value.lt) filters[key] = { ...filters[key], $lt: value.lt };
        if (value.lte) filters[key] = { ...filters[key], $lte: value.lte };
      } else if (value === 'true' || value === 'false') {
        filters[key] = value === 'true';
      } else {
        filters[key] = value;
      }
    }
  }
  
  return filters;
};

/**
 * Calculate test score with negative marking
 */
const calculateTestScore = (answers, questions, negativeMarkingPercentage = 25) => {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let totalMarks = 0;
  let obtainedMarks = 0;

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const marks = question.marks || 1;
    totalMarks += marks;

    if (userAnswer === null || userAnswer === undefined) {
      unansweredCount++;
    } else if (userAnswer === question.correctAnswer) {
      correctCount++;
      obtainedMarks += marks;
    } else {
      incorrectCount++;
      // Apply negative marking
      const negativeMark = (marks * negativeMarkingPercentage) / 100;
      obtainedMarks -= negativeMark;
    }
  });

  // Ensure obtained marks don't go below 0
  obtainedMarks = Math.max(0, obtainedMarks);

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    totalQuestions: questions.length,
    totalMarks,
    obtainedMarks: Math.round(obtainedMarks * 100) / 100,
    percentage: calculatePercentage(obtainedMarks, totalMarks)
  };
};

/**
 * Sanitize object - remove undefined and null values
 */
const sanitizeObject = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if string is valid MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  generateToken,
  generateUniqueId,
  generateSlug,
  generateTempPassword,
  calculatePercentage,
  formatDuration,
  paginateArray,
  buildPaginationInfo,
  parseQueryFilters,
  calculateTestScore,
  sanitizeObject,
  deepClone,
  isValidObjectId
};
