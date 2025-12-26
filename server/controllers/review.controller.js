const Review = require("../models/Review.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");

// @desc    Create a review
// @route   POST /api/reviews/:courseId
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "You must be enrolled in this course to leave a review",
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      course: courseId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // Create review
    const review = await Review.create({
      course: courseId,
      user: req.user.id,
      rating,
      comment,
    });

    // Add review to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { reviews: review._id },
    });

    await review.populate("user", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course reviews
// @route   GET /api/reviews/course/:courseId
// @access  Public
exports.getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ course: courseId, isApproved: true })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      course: courseId,
      isApproved: true,
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check if already marked
    const alreadyMarked = review.isHelpful.helpfulBy.includes(req.user.id);

    if (alreadyMarked) {
      // Remove from helpful
      review.isHelpful.helpfulBy = review.isHelpful.helpfulBy.filter(
        (id) => id.toString() !== req.user.id
      );
      review.isHelpful.helpfulCount -= 1;
    } else {
      // Add to helpful
      review.isHelpful.helpfulBy.push(req.user.id);
      review.isHelpful.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: alreadyMarked ? "Removed from helpful" : "Marked as helpful",
      review,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
