const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const InstructorProfile = require('../models/InstructorProfile');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { buildPaginationInfo } = require('../utils/helpers');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/v1/admin/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res, next) => {
  const [
    totalUsers,
    totalStudents,
    totalInstructors,
    totalCourses,
    publishedCourses,
    pendingCourses,
    totalEnrollments,
    revenueStats
  ] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'instructor', isActive: true }),
    Course.countDocuments(),
    Course.countDocuments({ status: 'published', isApproved: true }),
    Course.countDocuments({ status: 'pending_review' }),
    Enrollment.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount.final' },
          platformEarnings: { $sum: '$revenue.platformCommission' },
          instructorPayouts: { $sum: '$revenue.instructorEarnings' }
        }
      }
    ])
  ]);

  // Recent activity
  const recentEnrollments = await Enrollment.find()
    .populate('user', 'name email')
    .populate('course', 'title')
    .sort({ enrolledAt: -1 })
    .limit(5);

  const recentPayments = await Payment.find({ status: 'completed' })
    .populate('user', 'name')
    .populate('course', 'title')
    .sort({ paidAt: -1 })
    .limit(5);

  // Growth data (last 30 days vs previous 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [newUsersLast30, newUsersPrev30, newEnrollmentsLast30] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    Enrollment.countDocuments({ enrolledAt: { $gte: thirtyDaysAgo } })
  ]);

  return ApiResponse.success(res, {
    overview: {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      pendingCourses,
      totalEnrollments,
      revenue: revenueStats[0] || { totalRevenue: 0, platformEarnings: 0, instructorPayouts: 0 }
    },
    growth: {
      newUsers: newUsersLast30,
      userGrowth: newUsersPrev30 > 0 
        ? Math.round(((newUsersLast30 - newUsersPrev30) / newUsersPrev30) * 100)
        : 100,
      newEnrollments: newEnrollmentsLast30
    },
    recentActivity: {
      enrollments: recentEnrollments,
      payments: recentPayments
    }
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, role, status, search, sort = 'newest' } = req.query;

  const query = {};
  
  if (role) query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  let sortOption = {};
  switch (sort) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'name':
      sortOption = { name: 1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-refreshToken')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, users, pagination);
});

/**
 * @desc    Get user details
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-refreshToken');

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  let additionalData = {};

  if (user.role === 'instructor') {
    additionalData.instructorProfile = await InstructorProfile.findOne({ user: user._id });
    additionalData.courses = await Course.find({ instructor: user._id })
      .select('title status enrollmentCount averageRating');
  }

  if (user.role === 'student') {
    additionalData.enrollments = await Enrollment.find({ user: user._id })
      .populate('course', 'title')
      .select('course status progress enrolledAt');
    additionalData.payments = await Payment.find({ user: user._id, status: 'completed' })
      .select('orderId amount paidAt');
  }

  // Activity logs
  additionalData.recentActivity = await AuditLog.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  return ApiResponse.success(res, { user, ...additionalData });
});

/**
 * @desc    Update user status
 * @route   PUT /api/v1/admin/users/:id/status
 * @access  Private/Admin
 */
const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive, isApproved } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  // Prevent deactivating own account
  if (user._id.toString() === req.user._id.toString() && isActive === false) {
    return next(ApiError.badRequest('Cannot deactivate your own account'));
  }

  const previousStatus = { isActive: user.isActive, isApproved: user.isApproved };

  if (isActive !== undefined) user.isActive = isActive;
  if (isApproved !== undefined) user.isApproved = isApproved;

  await user.save();

  // Notify user
  if (isActive === false) {
    await Notification.createNotification(
      user._id,
      'account_update',
      'Account Suspended',
      'Your account has been suspended. Please contact support.',
      {}
    );
  } else if (isActive === true && previousStatus.isActive === false) {
    await Notification.createNotification(
      user._id,
      'account_update',
      'Account Reactivated',
      'Your account has been reactivated.',
      {}
    );
  }

  await AuditLog.log({
    userId: req.user._id,
    action: isActive ? 'user_activated' : 'user_suspended',
    category: 'admin',
    description: `User status updated: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    previousData: previousStatus,
    newData: { isActive, isApproved },
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { user }, 'User status updated');
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(ApiError.notFound('User not found'));
  }

  if (user._id.toString() === req.user._id.toString()) {
    return next(ApiError.badRequest('Cannot delete your own account'));
  }

  if (user.role === 'admin') {
    return next(ApiError.badRequest('Cannot delete admin account'));
  }

  // For instructors, check if they have courses
  if (user.role === 'instructor') {
    const courseCount = await Course.countDocuments({ instructor: user._id });
    if (courseCount > 0) {
      return next(ApiError.badRequest('Cannot delete instructor with existing courses'));
    }
    await InstructorProfile.findOneAndDelete({ user: user._id });
  }

  await user.deleteOne();

  await AuditLog.log({
    userId: req.user._id,
    action: 'user_deleted',
    category: 'admin',
    description: `User deleted: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, null, 'User deleted');
});

/**
 * @desc    Get all instructors
 * @route   GET /api/v1/admin/instructors
 * @access  Private/Admin
 */
const getInstructors = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = { role: 'instructor' };

  if (status === 'approved') query.isApproved = true;
  if (status === 'pending') query.isApproved = false;
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [instructors, total] = await Promise.all([
    User.find(query)
      .select('name email avatar isActive isApproved createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query)
  ]);

  // Get instructor profiles
  const instructorsWithProfiles = await Promise.all(
    instructors.map(async (instructor) => {
      const profile = await InstructorProfile.findOne({ user: instructor._id });
      const courseCount = await Course.countDocuments({ instructor: instructor._id });
      return {
        ...instructor.toObject(),
        profile,
        courseCount
      };
    })
  );

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, instructorsWithProfiles, pagination);
});

/**
 * @desc    Get audit logs
 * @route   GET /api/v1/admin/audit-logs
 * @access  Private/Admin
 */
const getAuditLogs = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 50, 
    userId, 
    action, 
    category,
    startDate,
    endDate 
  } = req.query;

  const query = {};

  if (userId) query.user = userId;
  if (action) query.action = action;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    AuditLog.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, logs, pagination);
});

/**
 * @desc    Get platform analytics
 * @route   GET /api/v1/admin/analytics
 * @access  Private/Admin
 */
const getAnalytics = asyncHandler(async (req, res, next) => {
  const { period = '30' } = req.query;
  const days = parseInt(period);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // User growth
  const userGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          role: '$role'
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);

  // Enrollment trends
  const enrollmentTrends = await Enrollment.aggregate([
    { $match: { enrolledAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$enrolledAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Revenue trends
  const revenueTrends = await Payment.aggregate([
    { $match: { status: 'completed', paidAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
        revenue: { $sum: '$amount.final' },
        platformEarnings: { $sum: '$revenue.platformCommission' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Top performing courses
  const topCourses = await Course.find({ status: 'published' })
    .sort({ enrollmentCount: -1 })
    .limit(10)
    .populate('instructor', 'name')
    .select('title enrollmentCount averageRating totalRevenue');

  // Completion rates
  const completionStats = await Enrollment.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        avgProgress: { $avg: '$progress.percentComplete' }
      }
    }
  ]);

  return ApiResponse.success(res, {
    userGrowth,
    enrollmentTrends,
    revenueTrends,
    topCourses,
    completionStats: completionStats[0] || { total: 0, completed: 0, avgProgress: 0 }
  });
});

/**
 * @desc    Send announcement
 * @route   POST /api/v1/admin/announcements
 * @access  Private/Admin
 */
const sendAnnouncement = asyncHandler(async (req, res, next) => {
  const { title, message, targetRole, courseId } = req.body;

  let targetUsers = [];

  if (courseId) {
    // Send to enrolled students
    const enrollments = await Enrollment.find({ 
      course: courseId,
      status: { $in: ['active', 'completed'] }
    }).select('user');
    targetUsers = enrollments.map(e => e.user);
  } else if (targetRole) {
    // Send to specific role
    const users = await User.find({ role: targetRole, isActive: true }).select('_id');
    targetUsers = users.map(u => u._id);
  } else {
    // Send to all users
    const users = await User.find({ isActive: true }).select('_id');
    targetUsers = users.map(u => u._id);
  }

  // Create notifications
  await Promise.all(
    targetUsers.map(userId =>
      Notification.createNotification(
        userId,
        'announcement',
        title,
        message,
        { link: '/announcements' }
      )
    )
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'announcement_created',
    category: 'admin',
    description: `Announcement sent to ${targetUsers.length} users: ${title}`,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, {
    recipientCount: targetUsers.length
  }, 'Announcement sent successfully');
});

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  deleteUser,
  getInstructors,
  getAuditLogs,
  getAnalytics,
  sendAnnouncement
};
