const Enrollment = require("../models/Enrollment.model");
const Course = require("../models/Course.model");
const User = require("../models/User.model");

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Update course enrolled students
    await Course.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: req.user.id },
      $inc: { "stats.totalStudents": 1 },
    });

    // Update user enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: {
        enrolledCourses: {
          course: courseId,
          enrolledAt: Date.now(),
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        select: "title thumbnail instructor duration category level",
        populate: { path: "instructor", select: "name avatar" },
      })
      .populate("currentLesson", "title duration")
      .sort({ lastAccessed: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private
exports.getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("course")
      .populate("completedLessons.lesson");

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check ownership
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this enrollment",
      });
    }

    res.status(200).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as complete
// @route   PUT /api/enrollments/:id/lessons/:lessonId/complete
// @access  Private
exports.completeLesson = async (req, res, next) => {
  try {
    const { id, lessonId } = req.params;

    const enrollment = await Enrollment.findById(id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check if already completed
    const alreadyCompleted = enrollment.completedLessons.some(
      (item) => item.lesson.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({
        lesson: lessonId,
        completedAt: Date.now(),
      });
      enrollment.lastAccessed = Date.now();
      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      message: "Lesson marked as complete",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
