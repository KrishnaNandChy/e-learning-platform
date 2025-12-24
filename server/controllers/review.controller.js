const Review = require('../models/Review.model');
const Course = require('../models/Course.model');
const User = require('../models/User.model');

/**
 * @desc    Get reviews for a course
 * @route   GET /api/courses/:courseId/reviews
 * @access  Public
 */
exports.getCourseReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let sortOption = {};
    switch (sort) {
      case 'helpful':
        sortOption = { helpful: -1 };
        break;
      case 'highest':
        sortOption = { rating: -1 };
        break;
      case 'lowest':
        sortOption = { rating: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ course: req.params.courseId });

    // Get rating breakdown
    const ratingBreakdown = await Review.aggregate([
      { $match: { course: require('mongoose').Types.ObjectId(req.params.courseId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: reviews,
      ratingBreakdown,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch reviews' 
    });
  }
};

/**
 * @desc    Add review
 * @route   POST /api/courses/:courseId/reviews
 * @access  Private
 */
exports.addReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Check if user is enrolled
    const user = await User.findById(userId);
    const isEnrolled = user.enrolledCourses.some(
      (e) => e.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(400).json({ 
        success: false,
        message: 'You must be enrolled in the course to leave a review' 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ user: userId, course: courseId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already reviewed this course' 
      });
    }

    // Check if completed
    const enrollment = user.enrolledCourses.find(
      (e) => e.course.toString() === courseId
    );

    const review = await Review.create({
      user: userId,
      course: courseId,
      rating,
      title,
      comment,
      isVerified: enrollment.completed,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review,
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already reviewed this course' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to add review' 
    });
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
exports.updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found' 
      });
    }

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this review' 
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update review' 
    });
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found' 
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this review' 
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete review' 
    });
  }
};

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false,
        message: 'Review not found' 
      });
    }

    const userId = req.user.id;

    if (review.helpfulBy.includes(userId)) {
      // Remove helpful
      review.helpfulBy = review.helpfulBy.filter((id) => id.toString() !== userId);
      review.helpful = review.helpfulBy.length;
    } else {
      // Add helpful
      review.helpfulBy.push(userId);
      review.helpful = review.helpfulBy.length;
    }

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update' 
    });
  }
};
