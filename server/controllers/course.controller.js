const mongoose = require('mongoose');
const Course = require('../models/Course.model');
const User = require('../models/User.model');
const Notification = require('../models/Notification.model');

/**
 * Helper to validate MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @desc    Get all published courses with filters
 * @route   GET /api/courses
 * @access  Public
 */
exports.getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      level,
      price,
      rating,
      sort = 'popular',
      page = 1,
      limit = 12,
    } = req.query;

    // Build query
    const query = { isPublished: true };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All Levels') {
      query.level = { $regex: new RegExp(level, 'i') };
    }

    // Price filter
    if (price) {
      if (price === 'free') {
        query.price = 0;
      } else if (price === '0-500') {
        query.price = { $gt: 0, $lte: 500 };
      } else if (price === '500-1000') {
        query.price = { $gt: 500, $lte: 1000 };
      } else if (price === '1000+') {
        query.price = { $gt: 1000 };
      }
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rated':
        sortOption = { rating: -1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'popular':
      default:
        sortOption = { totalStudents: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar rating')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses' 
    });
  }
};

/**
 * @desc    Get single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(id)
      .populate('instructor', 'name avatar bio rating totalStudents totalCourses')
      .populate({
        path: 'sections.lessons',
        select: 'title duration type isPreview order',
      });

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch course' 
    });
  }
};

/**
 * @desc    Get featured courses
 * @route   GET /api/courses/featured
 * @access  Public
 */
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('instructor', 'name avatar')
      .sort({ rating: -1 })
      .limit(8);

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch featured courses' 
    });
  }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Instructor/Admin)
 */
exports.createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id,
    };

    const course = await Course.create(courseData);

    // Update instructor's course count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalCourses: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create course' 
    });
  }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Owner/Admin)
 */
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    let course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this course' 
      });
    }

    course = await Course.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update course' 
    });
  }
};

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Owner/Admin)
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this course' 
      });
    }

    await course.deleteOne();

    // Update instructor's course count
    await User.findByIdAndUpdate(course.instructor, {
      $inc: { totalCourses: -1 },
    });

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete course' 
    });
  }
};

/**
 * @desc    Publish/Unpublish course
 * @route   PUT /api/courses/:id/publish
 * @access  Private (Owner/Admin)
 */
exports.publishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    course.isPublished = !course.isPublished;
    if (course.isPublished) {
      course.publishedAt = new Date();
    }
    await course.save();

    res.json({
      success: true,
      message: course.isPublished ? 'Course published' : 'Course unpublished',
      data: course,
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update course status' 
    });
  }
};

/**
 * @desc    Enroll in course
 * @route   POST /api/courses/:id/enroll
 * @access  Private (Student)
 */
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({ 
        success: false,
        message: 'Course is not available for enrollment' 
      });
    }

    const user = await User.findById(userId);

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      (e) => e.course && e.course.toString() === courseId
    );

    if (isEnrolled) {
      return res.status(400).json({ 
        success: false,
        message: 'You are already enrolled in this course' 
      });
    }

    // Add enrollment
    user.enrolledCourses.push({
      course: courseId,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
    });
    await user.save();

    // Update course statistics
    course.totalStudents += 1;
    await course.save();

    // Update instructor's total students
    await User.findByIdAndUpdate(course.instructor, {
      $inc: { totalStudents: 1 },
    });

    // Create notification
    await Notification.create({
      user: userId,
      type: 'enrollment',
      title: 'Enrollment Successful',
      message: `You have been enrolled in "${course.title}"`,
      data: { courseId: course._id },
    });

    res.json({
      success: true,
      message: 'Enrolled successfully',
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Enrollment failed' 
    });
  }
};

/**
 * @desc    Get enrolled courses
 * @route   GET /api/courses/user/enrolled
 * @access  Private
 */
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail instructor totalLessons duration',
        populate: { path: 'instructor', select: 'name' },
      });

    res.json({
      success: true,
      data: user.enrolledCourses,
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch enrolled courses' 
    });
  }
};

/**
 * @desc    Get courses by instructor
 * @route   GET /api/courses/instructor/my-courses
 * @access  Private (Instructor)
 */
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses' 
    });
  }
};

/**
 * @desc    Update lesson progress
 * @route   PUT /api/courses/:id/progress
 * @access  Private
 */
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const courseId = req.params.id;
    const userId = req.user.id;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const user = await User.findById(userId);
    const enrollment = user.enrolledCourses.find(
      (e) => e.course && e.course.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({ 
        success: false,
        message: 'Not enrolled in this course' 
      });
    }

    // Add completed lesson if not already completed
    if (lessonId && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress
    const course = await Course.findById(courseId);
    const totalLessons = course.totalLessons || 1;
    enrollment.progress = Math.round(
      (enrollment.completedLessons.length / totalLessons) * 100
    );

    // Check if completed
    if (enrollment.progress >= 100) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      progress: enrollment.progress,
      completed: enrollment.completed,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update progress' 
    });
  }
};

/**
 * @desc    Add course to wishlist
 * @route   POST /api/courses/:id/wishlist
 * @access  Private
 */
exports.toggleWishlist = async (req, res) => {
  try {
    const courseId = req.params.id;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid course ID format' 
      });
    }

    const user = await User.findById(req.user.id);

    const index = user.wishlist.indexOf(courseId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ success: true, message: 'Removed from wishlist', added: false });
    } else {
      user.wishlist.push(courseId);
      await user.save();
      res.json({ success: true, message: 'Added to wishlist', added: true });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update wishlist' 
    });
  }
};
