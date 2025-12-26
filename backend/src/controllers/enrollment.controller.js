const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const InstructorProfile = require('../models/InstructorProfile');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sendEmail, emailTemplates } = require('../config/email');
const { buildPaginationInfo } = require('../utils/helpers');

/**
 * @desc    Get user's enrollments
 * @route   GET /api/v1/enrollments
 * @access  Private
 */
const getMyEnrollments = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status = 'active', sort = 'recent' } = req.query;

  const query = { user: req.user._id };
  if (status !== 'all') {
    query.status = status;
  }

  let sortOption = {};
  switch (sort) {
    case 'recent':
      sortOption = { 'progress.lastAccessedAt': -1, enrolledAt: -1 };
      break;
    case 'oldest':
      sortOption = { enrolledAt: 1 };
      break;
    case 'progress':
      sortOption = { 'progress.percentComplete': -1 };
      break;
    default:
      sortOption = { enrolledAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title slug thumbnail totalLessons totalDuration instructor',
        populate: { path: 'instructor', select: 'name' }
      })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Enrollment.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, enrollments, pagination);
});

/**
 * @desc    Get single enrollment
 * @route   GET /api/v1/enrollments/:courseId
 * @access  Private
 */
const getEnrollment = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId
  }).populate({
    path: 'course',
    populate: [
      { path: 'instructor', select: 'name avatar' },
      { path: 'curriculum.lessons', select: 'title type duration isFreePreview order' }
    ]
  });

  if (!enrollment) {
    return next(ApiError.notFound('Enrollment not found'));
  }

  return ApiResponse.success(res, { enrollment });
});

/**
 * @desc    Enroll in a free course
 * @route   POST /api/v1/enrollments/free/:courseId
 * @access  Private
 */
const enrollFree = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate('instructor', 'name email');

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (!course.isFree && course.price > 0) {
    return next(ApiError.badRequest('This course requires payment'));
  }

  if (course.status !== 'published' || !course.isApproved) {
    return next(ApiError.badRequest('This course is not available for enrollment'));
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId
  });

  if (existingEnrollment) {
    return next(ApiError.conflict('You are already enrolled in this course'));
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: courseId,
    enrollmentType: 'free',
    pricePaid: 0,
    status: 'active'
  });

  // Update course enrollment count
  course.enrollmentCount += 1;
  await course.save();

  // Update instructor stats
  await InstructorProfile.findOneAndUpdate(
    { user: course.instructor._id },
    { $inc: { totalStudents: 1 } }
  );

  // Send confirmation email
  const emailContent = emailTemplates.enrollmentConfirmation(
    req.user.name,
    course.title,
    course.instructor.name
  );

  await sendEmail({
    to: req.user.email,
    subject: emailContent.subject,
    html: emailContent.html
  });

  // Create notification
  await Notification.createNotification(
    req.user._id,
    'enrollment',
    `Welcome to ${course.title}!`,
    'Start learning now and achieve your goals!',
    { courseId: course._id, link: `/learn/${course.slug}` }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'enrollment_created',
    category: 'course',
    description: `Enrolled in free course: ${course.title}`,
    resourceType: 'enrollment',
    resourceId: enrollment._id,
    ipAddress: req.ip
  });

  return ApiResponse.created(res, { enrollment }, 'Successfully enrolled in course');
});

/**
 * @desc    Create enrollment after payment
 * @route   POST /api/v1/enrollments/paid/:courseId
 * @access  Private (called internally after payment)
 */
const createPaidEnrollment = async (userId, courseId, paymentId, amount) => {
  const course = await Course.findById(courseId).populate('instructor', 'name');

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
    enrollmentType: 'paid',
    payment: paymentId,
    pricePaid: amount,
    status: 'active'
  });

  // Update course stats
  course.enrollmentCount += 1;
  course.totalRevenue += amount;
  await course.save();

  // Update instructor stats
  await InstructorProfile.findOneAndUpdate(
    { user: course.instructor._id },
    { $inc: { totalStudents: 1 } }
  );

  // Create notification
  await Notification.createNotification(
    userId,
    'enrollment',
    `Welcome to ${course.title}!`,
    'Your enrollment is confirmed. Start learning now!',
    { courseId: course._id, link: `/learn/${course.slug}` }
  );

  return enrollment;
};

/**
 * @desc    Update enrollment (bookmark, rating, etc.)
 * @route   PUT /api/v1/enrollments/:courseId
 * @access  Private
 */
const updateEnrollment = asyncHandler(async (req, res, next) => {
  const { bookmark, rating, review } = req.body;

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.courseId
  });

  if (!enrollment) {
    return next(ApiError.notFound('Enrollment not found'));
  }

  // Add bookmark
  if (bookmark) {
    const existingBookmark = enrollment.bookmarks.find(
      b => b.lesson.toString() === bookmark.lessonId
    );
    
    if (existingBookmark) {
      existingBookmark.timestamp = bookmark.timestamp;
      existingBookmark.note = bookmark.note;
    } else {
      enrollment.bookmarks.push({
        lesson: bookmark.lessonId,
        timestamp: bookmark.timestamp,
        note: bookmark.note
      });
    }
  }

  // Add rating/review
  if (rating) {
    enrollment.rating = {
      value: rating,
      review: review || enrollment.rating?.review,
      reviewedAt: new Date()
    };
    
    // This will trigger the review model to update course stats
  }

  await enrollment.save();

  return ApiResponse.success(res, { enrollment }, 'Enrollment updated');
});

/**
 * @desc    Remove bookmark
 * @route   DELETE /api/v1/enrollments/:courseId/bookmarks/:bookmarkId
 * @access  Private
 */
const removeBookmark = asyncHandler(async (req, res, next) => {
  const { courseId, bookmarkId } = req.params;

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return next(ApiError.notFound('Enrollment not found'));
  }

  enrollment.bookmarks = enrollment.bookmarks.filter(
    b => b._id.toString() !== bookmarkId
  );

  await enrollment.save();

  return ApiResponse.success(res, { bookmarks: enrollment.bookmarks }, 'Bookmark removed');
});

/**
 * @desc    Get course students (Instructor)
 * @route   GET /api/v1/enrollments/course/:courseId/students
 * @access  Private/Instructor
 */
const getCourseStudents = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { page = 1, limit = 20, status, search } = req.query;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  // Check authorization
  if (course.instructor.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const query = { course: courseId };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let enrollmentsQuery = Enrollment.find(query)
    .populate('user', 'name email avatar')
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Handle search
  if (search) {
    const users = await require('../models/User').find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }).select('_id');
    
    const userIds = users.map(u => u._id);
    query.user = { $in: userIds };
  }

  const [enrollments, total] = await Promise.all([
    enrollmentsQuery,
    Enrollment.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, enrollments, pagination);
});

/**
 * @desc    Get enrollment analytics (Instructor)
 * @route   GET /api/v1/enrollments/course/:courseId/analytics
 * @access  Private/Instructor
 */
const getEnrollmentAnalytics = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Aggregation for analytics
  const stats = await Enrollment.aggregate([
    { $match: { course: course._id } },
    {
      $group: {
        _id: null,
        totalStudents: { $sum: 1 },
        activeStudents: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        completedStudents: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        avgProgress: { $avg: '$progress.percentComplete' },
        totalRevenue: { $sum: '$pricePaid' }
      }
    }
  ]);

  // Enrollments over time
  const enrollmentsByMonth = await Enrollment.aggregate([
    { $match: { course: course._id } },
    {
      $group: {
        _id: {
          year: { $year: '$enrolledAt' },
          month: { $month: '$enrolledAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  // Progress distribution
  const progressDistribution = await Enrollment.aggregate([
    { $match: { course: course._id } },
    {
      $bucket: {
        groupBy: '$progress.percentComplete',
        boundaries: [0, 25, 50, 75, 100, 101],
        default: 'Unknown',
        output: { count: { $sum: 1 } }
      }
    }
  ]);

  return ApiResponse.success(res, {
    overview: stats[0] || {
      totalStudents: 0,
      activeStudents: 0,
      completedStudents: 0,
      avgProgress: 0,
      totalRevenue: 0
    },
    enrollmentsByMonth,
    progressDistribution
  });
});

/**
 * @desc    Process refund
 * @route   POST /api/v1/enrollments/:enrollmentId/refund
 * @access  Private/Admin
 */
const processRefund = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const enrollment = await Enrollment.findById(req.params.enrollmentId)
    .populate('course', 'title')
    .populate('user', 'name email')
    .populate('payment');

  if (!enrollment) {
    return next(ApiError.notFound('Enrollment not found'));
  }

  if (enrollment.status === 'refunded') {
    return next(ApiError.badRequest('Enrollment already refunded'));
  }

  // Process payment refund
  if (enrollment.payment) {
    await enrollment.payment.processRefund(
      enrollment.pricePaid,
      reason,
      req.user._id
    );
  }

  enrollment.status = 'refunded';
  await enrollment.save();

  // Update course stats
  await Course.findByIdAndUpdate(enrollment.course._id, {
    $inc: { enrollmentCount: -1, totalRevenue: -enrollment.pricePaid }
  });

  // Update instructor stats
  const course = await Course.findById(enrollment.course._id);
  await InstructorProfile.findOneAndUpdate(
    { user: course.instructor },
    { $inc: { totalStudents: -1 } }
  );

  // Notify user
  await Notification.createNotification(
    enrollment.user._id,
    'refund_processed',
    'Refund Processed',
    `Your refund for "${enrollment.course.title}" has been processed.`,
    { link: '/my-orders' }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'refund_completed',
    category: 'payment',
    description: `Refund processed for ${enrollment.user.email} - ${enrollment.course.title}`,
    resourceType: 'enrollment',
    resourceId: enrollment._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { enrollment }, 'Refund processed successfully');
});

module.exports = {
  getMyEnrollments,
  getEnrollment,
  enrollFree,
  createPaidEnrollment,
  updateEnrollment,
  removeBookmark,
  getCourseStudents,
  getEnrollmentAnalytics,
  processRefund
};
