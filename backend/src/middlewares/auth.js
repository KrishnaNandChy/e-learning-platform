const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    
    if (!token) {
      return next(ApiError.unauthorized('Access token is required'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }
    
    if (!user.isActive) {
      return next(ApiError.forbidden('Your account has been deactivated'));
    }
    
    if (!user.isApproved && user.role !== 'student') {
      return next(ApiError.forbidden('Your account is pending approval'));
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Access token has expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid access token'));
    }
    logger.error('Authentication error:', error);
    return next(ApiError.unauthorized('Authentication failed'));
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user
    next();
  }
};

/**
 * Role-based access control middleware
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Role '${req.user.role}' is not authorized to access this resource`));
    }
    
    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
const authorizeOwnerOrAdmin = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    
    const resourceOwnerId = req.params[resourceField] || req.body[resourceField];
    const isOwner = resourceOwnerId && req.user._id.toString() === resourceOwnerId.toString();
    const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);
    
    if (!isOwner && !isAdmin) {
      return next(ApiError.forbidden('You are not authorized to access this resource'));
    }
    
    next();
  };
};

/**
 * Check if user is enrolled in course
 */
const requireEnrollment = async (req, res, next) => {
  try {
    const Enrollment = require('../models/Enrollment');
    const courseId = req.params.courseId || req.body.courseId;
    
    if (!courseId) {
      return next(ApiError.badRequest('Course ID is required'));
    }
    
    // Admin and instructors have access
    if (['admin', 'admin_helper'].includes(req.user.role)) {
      return next();
    }
    
    // Check if user is the instructor
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    
    if (course && course.instructor.toString() === req.user._id.toString()) {
      return next();
    }
    
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
      status: { $in: ['active', 'completed'] }
    });
    
    if (!enrollment) {
      return next(ApiError.forbidden('You must be enrolled in this course to access this resource'));
    }
    
    req.enrollment = enrollment;
    next();
  } catch (error) {
    logger.error('Enrollment check error:', error);
    return next(ApiError.internal('Error checking enrollment'));
  }
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!refreshToken) {
      return next(ApiError.unauthorized('Refresh token is required'));
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return next(ApiError.unauthorized('Invalid refresh token'));
    }
    
    if (!user.isActive) {
      return next(ApiError.forbidden('Your account has been deactivated'));
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Refresh token has expired'));
    }
    return next(ApiError.unauthorized('Invalid refresh token'));
  }
};

/**
 * Rate limiting by user
 */
const userRateLimit = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    if (!req.user) return next();
    
    const userId = req.user._id.toString();
    const now = Date.now();
    
    if (!requests.has(userId)) {
      requests.set(userId, { count: 1, startTime: now });
      return next();
    }
    
    const userData = requests.get(userId);
    
    if (now - userData.startTime > windowMs) {
      requests.set(userId, { count: 1, startTime: now });
      return next();
    }
    
    if (userData.count >= maxRequests) {
      return next(ApiError.badRequest('Too many requests. Please try again later.'));
    }
    
    userData.count++;
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  authorizeOwnerOrAdmin,
  requireEnrollment,
  verifyRefreshToken,
  userRateLimit
};
