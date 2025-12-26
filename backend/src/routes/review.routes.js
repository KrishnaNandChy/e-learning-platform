const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');
const { buildPaginationInfo } = require('../utils/helpers');

// Get reviews for a course (Public)
router.get('/course/:courseId', validateObjectId('courseId'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = 'newest', rating } = req.query;
  
  const query = { course: req.params.courseId, isApproved: true };
  if (rating) query.rating = parseInt(rating);
  
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'helpful':
      sortOption = { helpfulCount: -1 };
      break;
    case 'rating_high':
      sortOption = { rating: -1 };
      break;
    case 'rating_low':
      sortOption = { rating: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments(query)
  ]);
  
  const pagination = buildPaginationInfo(page, limit, total);
  
  return ApiResponse.paginated(res, reviews, pagination);
}));

// Protected routes
router.use(authenticate);

// Create/Update review
router.post('/course/:courseId', validateObjectId('courseId'), asyncHandler(async (req, res, next) => {
  const { rating, title, review, pros, cons } = req.body;
  
  // Check enrollment
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId,
    status: { $in: ['active', 'completed'] }
  });
  
  if (!enrollment) {
    return next(ApiError.forbidden('You must be enrolled to review'));
  }
  
  // Check existing review
  let existingReview = await Review.findOne({
    user: req.user._id,
    course: req.params.courseId
  });
  
  if (existingReview) {
    // Update existing
    existingReview.rating = rating;
    existingReview.title = title;
    existingReview.review = review;
    existingReview.pros = pros;
    existingReview.cons = cons;
    existingReview.isEdited = true;
    existingReview.editedAt = new Date();
    existingReview.completionPercentage = enrollment.progress.percentComplete;
    await existingReview.save();
    
    return ApiResponse.success(res, { review: existingReview }, 'Review updated');
  }
  
  // Create new
  const newReview = await Review.create({
    user: req.user._id,
    course: req.params.courseId,
    enrollment: enrollment._id,
    rating,
    title,
    review,
    pros,
    cons,
    completionPercentage: enrollment.progress.percentComplete
  });
  
  return ApiResponse.created(res, { review: newReview }, 'Review submitted');
}));

// Mark as helpful
router.put('/:id/helpful', validateObjectId('id'), asyncHandler(async (req, res, next) => {
  const { isHelpful } = req.body;
  
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(ApiError.notFound('Review not found'));
  }
  
  await review.markHelpful(req.user._id, isHelpful);
  
  return ApiResponse.success(res, { review }, 'Vote recorded');
}));

// Instructor response
router.post('/:id/response', authorize('instructor', 'admin'), validateObjectId('id'), asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  
  const review = await Review.findById(req.params.id).populate('course', 'instructor');
  if (!review) {
    return next(ApiError.notFound('Review not found'));
  }
  
  // Check instructor ownership
  if (req.user.role === 'instructor' && 
      review.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }
  
  await review.addResponse(content);
  
  return ApiResponse.success(res, { review }, 'Response added');
}));

// Delete review
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    return next(ApiError.notFound('Review not found'));
  }
  
  // Check ownership or admin
  if (review.user.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }
  
  await review.deleteOne();
  
  return ApiResponse.success(res, null, 'Review deleted');
}));

// Flag review
router.put('/:id/flag', authorize('admin', 'admin_helper'), validateObjectId('id'), asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(ApiError.notFound('Review not found'));
  }
  
  review.isFlagged = true;
  review.flagReason = reason;
  review.flaggedBy = req.user._id;
  review.isApproved = false;
  await review.save();
  
  return ApiResponse.success(res, { review }, 'Review flagged');
}));

module.exports = router;
