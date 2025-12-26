const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Category = require('../models/Category');
const Enrollment = require('../models/Enrollment');
const InstructorProfile = require('../models/InstructorProfile');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { buildPaginationInfo, generateSlug } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Get all courses (with filters)
 * @route   GET /api/v1/courses
 * @access  Public
 */
const getCourses = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    category,
    subcategory,
    level,
    minPrice,
    maxPrice,
    rating,
    search,
    sort = 'newest',
    instructor,
    isFree,
    isFeatured
  } = req.query;

  // Build query
  const query = {
    status: 'published',
    isApproved: true
  };

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (level) query.level = level;
  if (instructor) query.instructor = instructor;
  if (isFree === 'true') query.isFree = true;
  if (isFeatured === 'true') query.isFeatured = true;

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (rating) {
    query.averageRating = { $gte: parseFloat(rating) };
  }

  // Search
  if (search) {
    query.$text = { $search: search };
  }

  // Sort options
  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'popular':
      sortOption = { enrollmentCount: -1 };
      break;
    case 'rating':
      sortOption = { averageRating: -1 };
      break;
    case 'price_low':
      sortOption = { price: 1 };
      break;
    case 'price_high':
      sortOption = { price: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('instructor', 'name avatar')
      .populate('category', 'name slug')
      .select('-curriculum')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Course.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, courses, pagination, 'Courses retrieved successfully');
});

/**
 * @desc    Get single course
 * @route   GET /api/v1/courses/:slug
 * @access  Public
 */
const getCourse = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  const course = await Course.findOne({ slug })
    .populate('instructor', 'name avatar bio')
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate({
      path: 'curriculum.lessons',
      select: 'title type duration isFreePreview order description'
    });

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  // Get instructor profile
  const instructorProfile = await InstructorProfile.findOne({ user: course.instructor._id });

  // Check if user is enrolled (if authenticated)
  let isEnrolled = false;
  let enrollment = null;
  
  if (req.user) {
    enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
      status: { $in: ['active', 'completed'] }
    });
    isEnrolled = !!enrollment;
  }

  return ApiResponse.success(res, {
    course,
    instructorProfile,
    isEnrolled,
    enrollment
  });
});

/**
 * @desc    Create course
 * @route   POST /api/v1/courses
 * @access  Private/Instructor
 */
const createCourse = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    category,
    subcategory,
    level,
    language,
    price,
    isFree,
    whatYouWillLearn,
    requirements,
    targetAudience,
    tags
  } = req.body;

  // Verify category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(ApiError.badRequest('Invalid category'));
  }

  // Create course
  const course = await Course.create({
    title,
    description,
    instructor: req.user._id,
    category,
    subcategory,
    level,
    language,
    price: isFree ? 0 : price,
    isFree: isFree || price === 0,
    whatYouWillLearn,
    requirements,
    targetAudience,
    tags
  });

  // Update category course count
  await Category.findByIdAndUpdate(category, { $inc: { courseCount: 1 } });

  // Update instructor profile
  await InstructorProfile.findOneAndUpdate(
    { user: req.user._id },
    { $inc: { totalCourses: 1 } }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'course_created',
    category: 'course',
    description: `Course created: ${title}`,
    resourceType: 'course',
    resourceId: course._id,
    ipAddress: req.ip
  });

  return ApiResponse.created(res, { course }, 'Course created successfully');
});

/**
 * @desc    Update course
 * @route   PUT /api/v1/courses/:id
 * @access  Private/Instructor
 */
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  // Check ownership
  if (course.instructor.toString() !== req.user._id.toString() && 
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized to update this course'));
  }

  // Fields that can be updated
  const allowedFields = [
    'title', 'subtitle', 'description', 'category', 'subcategory',
    'level', 'language', 'price', 'discountPrice', 'discountValidUntil',
    'isFree', 'whatYouWillLearn', 'requirements', 'targetAudience',
    'tags', 'welcomeMessage', 'congratulationsMessage', 'certificateEnabled',
    'certificateCompletionThreshold'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // If price is set to 0 or isFree is true
  if (updates.isFree || updates.price === 0) {
    updates.isFree = true;
    updates.price = 0;
  }

  const previousData = course.toObject();

  course = await Course.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('instructor', 'name avatar')
   .populate('category', 'name slug');

  await AuditLog.log({
    userId: req.user._id,
    action: 'course_updated',
    category: 'course',
    description: `Course updated: ${course.title}`,
    resourceType: 'course',
    resourceId: course._id,
    previousData,
    newData: updates,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { course }, 'Course updated successfully');
});

/**
 * @desc    Upload course thumbnail
 * @route   PUT /api/v1/courses/:id/thumbnail
 * @access  Private/Instructor
 */
const uploadThumbnail = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!req.file) {
    return next(ApiError.badRequest('Please upload an image'));
  }

  // Delete old thumbnail if exists
  if (course.thumbnail.public_id) {
    await deleteFromCloudinary(course.thumbnail.public_id);
  }

  // Upload new thumbnail
  const result = await uploadToCloudinary(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
    'thumbnails',
    'image'
  );

  course.thumbnail = {
    public_id: result.public_id,
    url: result.url
  };
  await course.save();

  return ApiResponse.success(res, { thumbnail: course.thumbnail }, 'Thumbnail uploaded');
});

/**
 * @desc    Upload promo video
 * @route   PUT /api/v1/courses/:id/promo-video
 * @access  Private/Instructor
 */
const uploadPromoVideo = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!req.file) {
    return next(ApiError.badRequest('Please upload a video'));
  }

  // Delete old video if exists
  if (course.promoVideo.public_id) {
    await deleteFromCloudinary(course.promoVideo.public_id, 'video');
  }

  // Upload new video
  const result = await uploadToCloudinary(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
    'promo-videos',
    'video'
  );

  course.promoVideo = {
    public_id: result.public_id,
    url: result.url,
    duration: result.duration
  };
  await course.save();

  return ApiResponse.success(res, { promoVideo: course.promoVideo }, 'Promo video uploaded');
});

/**
 * @desc    Add section to curriculum
 * @route   POST /api/v1/courses/:id/sections
 * @access  Private/Instructor
 */
const addSection = asyncHandler(async (req, res, next) => {
  const { sectionTitle, sectionDescription } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const newSection = {
    sectionTitle,
    sectionDescription,
    order: course.curriculum.length,
    lessons: []
  };

  course.curriculum.push(newSection);
  await course.save();

  return ApiResponse.success(res, { course }, 'Section added successfully');
});

/**
 * @desc    Update section
 * @route   PUT /api/v1/courses/:id/sections/:sectionIndex
 * @access  Private/Instructor
 */
const updateSection = asyncHandler(async (req, res, next) => {
  const { sectionTitle, sectionDescription } = req.body;
  const { id, sectionIndex } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!course.curriculum[sectionIndex]) {
    return next(ApiError.notFound('Section not found'));
  }

  if (sectionTitle) course.curriculum[sectionIndex].sectionTitle = sectionTitle;
  if (sectionDescription) course.curriculum[sectionIndex].sectionDescription = sectionDescription;

  await course.save();

  return ApiResponse.success(res, { course }, 'Section updated successfully');
});

/**
 * @desc    Delete section
 * @route   DELETE /api/v1/courses/:id/sections/:sectionIndex
 * @access  Private/Instructor
 */
const deleteSection = asyncHandler(async (req, res, next) => {
  const { id, sectionIndex } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!course.curriculum[sectionIndex]) {
    return next(ApiError.notFound('Section not found'));
  }

  // Delete all lessons in the section
  const lessonIds = course.curriculum[sectionIndex].lessons;
  await Lesson.deleteMany({ _id: { $in: lessonIds } });

  // Remove section
  course.curriculum.splice(sectionIndex, 1);

  // Update order of remaining sections
  course.curriculum.forEach((section, index) => {
    section.order = index;
  });

  // Update total lessons
  course.totalLessons = course.curriculum.reduce(
    (total, section) => total + section.lessons.length, 0
  );

  await course.save();

  return ApiResponse.success(res, { course }, 'Section deleted successfully');
});

/**
 * @desc    Submit course for review
 * @route   PUT /api/v1/courses/:id/submit
 * @access  Private/Instructor
 */
const submitForReview = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (course.status !== 'draft') {
    return next(ApiError.badRequest('Course is not in draft status'));
  }

  // Validate course completeness
  if (!course.thumbnail.url) {
    return next(ApiError.badRequest('Course must have a thumbnail'));
  }

  if (course.curriculum.length === 0) {
    return next(ApiError.badRequest('Course must have at least one section'));
  }

  if (course.totalLessons === 0) {
    return next(ApiError.badRequest('Course must have at least one lesson'));
  }

  course.status = 'pending_review';
  await course.save();

  // Notify admins
  const admins = await require('../models/User').find({ 
    role: { $in: ['admin', 'admin_helper'] } 
  });
  
  for (const admin of admins) {
    await Notification.createNotification(
      admin._id,
      'course_update',
      'New Course Pending Review',
      `Course "${course.title}" is pending approval`,
      { courseId: course._id, link: `/admin/courses/${course._id}` }
    );
  }

  await AuditLog.log({
    userId: req.user._id,
    action: 'course_updated',
    category: 'course',
    description: `Course submitted for review: ${course.title}`,
    resourceType: 'course',
    resourceId: course._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { course }, 'Course submitted for review');
});

/**
 * @desc    Approve/Reject course (Admin)
 * @route   PUT /api/v1/courses/:id/approval
 * @access  Private/Admin
 */
const approveCourse = asyncHandler(async (req, res, next) => {
  const { action, reason } = req.body;

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.status !== 'pending_review') {
    return next(ApiError.badRequest('Course is not pending review'));
  }

  if (action === 'approve') {
    course.status = 'published';
    course.isApproved = true;
    course.approvedBy = req.user._id;
    course.approvedAt = new Date();
    course.publishedAt = new Date();

    await Notification.createNotification(
      course.instructor,
      'course_approved',
      'Course Approved! 🎉',
      `Your course "${course.title}" has been approved and is now live!`,
      { courseId: course._id, link: `/courses/${course.slug}` }
    );

    await AuditLog.log({
      userId: req.user._id,
      action: 'course_approved',
      category: 'admin',
      description: `Course approved: ${course.title}`,
      resourceType: 'course',
      resourceId: course._id,
      ipAddress: req.ip
    });
  } else if (action === 'reject') {
    course.status = 'rejected';
    course.rejectionReason = reason;

    await Notification.createNotification(
      course.instructor,
      'course_rejected',
      'Course Needs Revision',
      `Your course "${course.title}" requires changes: ${reason}`,
      { courseId: course._id, link: `/instructor/courses/${course._id}` }
    );

    await AuditLog.log({
      userId: req.user._id,
      action: 'course_rejected',
      category: 'admin',
      description: `Course rejected: ${course.title} - ${reason}`,
      resourceType: 'course',
      resourceId: course._id,
      ipAddress: req.ip
    });
  }

  await course.save();

  return ApiResponse.success(res, { course }, `Course ${action}ed successfully`);
});

/**
 * @desc    Delete course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private/Instructor/Admin
 */
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  // Check authorization
  if (course.instructor.toString() !== req.user._id.toString() &&
      !['admin'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Check if there are enrollments
  const enrollmentCount = await Enrollment.countDocuments({ course: course._id });
  if (enrollmentCount > 0 && req.user.role !== 'admin') {
    return next(ApiError.badRequest('Cannot delete course with existing enrollments'));
  }

  // Delete associated resources
  // Delete lessons
  await Lesson.deleteMany({ course: course._id });

  // Delete thumbnail and promo video from cloudinary
  if (course.thumbnail.public_id) {
    await deleteFromCloudinary(course.thumbnail.public_id);
  }
  if (course.promoVideo.public_id) {
    await deleteFromCloudinary(course.promoVideo.public_id, 'video');
  }

  // Update category course count
  await Category.findByIdAndUpdate(course.category, { $inc: { courseCount: -1 } });

  // Update instructor profile
  await InstructorProfile.findOneAndUpdate(
    { user: course.instructor },
    { $inc: { totalCourses: -1 } }
  );

  await course.deleteOne();

  await AuditLog.log({
    userId: req.user._id,
    action: 'course_deleted',
    category: 'course',
    description: `Course deleted: ${course.title}`,
    resourceType: 'course',
    resourceId: course._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, null, 'Course deleted successfully');
});

/**
 * @desc    Get instructor's courses
 * @route   GET /api/v1/courses/instructor/my-courses
 * @access  Private/Instructor
 */
const getInstructorCourses = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { instructor: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Course.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, courses, pagination);
});

/**
 * @desc    Get courses pending approval (Admin)
 * @route   GET /api/v1/courses/admin/pending
 * @access  Private/Admin
 */
const getPendingCourses = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [courses, total] = await Promise.all([
    Course.find({ status: 'pending_review' })
      .populate('instructor', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Course.countDocuments({ status: 'pending_review' })
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, courses, pagination);
});

/**
 * @desc    Toggle featured status (Admin)
 * @route   PUT /api/v1/courses/:id/featured
 * @access  Private/Admin
 */
const toggleFeatured = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  course.isFeatured = !course.isFeatured;
  await course.save();

  return ApiResponse.success(res, { course }, `Course ${course.isFeatured ? 'featured' : 'unfeatured'}`);
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  uploadThumbnail,
  uploadPromoVideo,
  addSection,
  updateSection,
  deleteSection,
  submitForReview,
  approveCourse,
  deleteCourse,
  getInstructorCourses,
  getPendingCourses,
  toggleFeatured
};
