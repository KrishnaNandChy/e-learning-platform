const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const InstructorProfile = require('../models/InstructorProfile');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sendEmail, emailTemplates } = require('../config/email');
const { buildPaginationInfo } = require('../utils/helpers');
const { createPaidEnrollment } = require('./enrollment.controller');

/**
 * @desc    Create payment intent
 * @route   POST /api/v1/payments/create-intent
 * @access  Private
 */
const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { courseId, couponCode } = req.body;

  const course = await Course.findById(courseId)
    .populate('instructor', 'name email');

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (!course.isApproved || course.status !== 'published') {
    return next(ApiError.badRequest('Course is not available for purchase'));
  }

  if (course.isFree) {
    return next(ApiError.badRequest('This is a free course'));
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId,
    status: { $nin: ['refunded'] }
  });

  if (existingEnrollment) {
    return next(ApiError.conflict('You are already enrolled in this course'));
  }

  // Calculate price
  let finalPrice = course.effectivePrice;
  let discountAmount = 0;

  // Apply coupon if provided
  if (couponCode) {
    // TODO: Implement coupon logic
    // const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
  }

  // Create payment record
  const payment = await Payment.create({
    user: req.user._id,
    course: courseId,
    instructor: course.instructor._id,
    amount: {
      original: course.price,
      discount: course.price - finalPrice + discountAmount,
      final: finalPrice,
      currency: 'INR'
    },
    couponCode,
    paymentMethod: 'card',
    paymentGateway: 'stripe',
    billing: {
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone
    }
  });

  // Calculate revenue split
  const instructorProfile = await InstructorProfile.findOne({ user: course.instructor._id });
  payment.calculateRevenue(instructorProfile?.commissionRate || 30);
  await payment.save();

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(finalPrice * 100), // Stripe requires amount in smallest currency unit
    currency: 'inr',
    metadata: {
      orderId: payment.orderId,
      courseId: courseId,
      userId: req.user._id.toString()
    },
    receipt_email: req.user.email,
    description: `Enrollment in ${course.title}`
  });

  payment.gatewayOrderId = paymentIntent.id;
  await payment.save();

  await AuditLog.log({
    userId: req.user._id,
    action: 'payment_initiated',
    category: 'payment',
    description: `Payment initiated for ${course.title}`,
    resourceType: 'payment',
    resourceId: payment._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, {
    clientSecret: paymentIntent.client_secret,
    orderId: payment.orderId,
    amount: payment.amount
  });
});

/**
 * @desc    Confirm payment
 * @route   POST /api/v1/payments/confirm
 * @access  Private
 */
const confirmPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentIntentId } = req.body;

  const payment = await Payment.findOne({ orderId })
    .populate('course', 'title slug')
    .populate('instructor', 'name');

  if (!payment) {
    return next(ApiError.notFound('Payment not found'));
  }

  if (payment.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Verify with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    payment.status = 'failed';
    await payment.save();

    await Notification.createNotification(
      req.user._id,
      'payment_failed',
      'Payment Failed',
      `Your payment for "${payment.course.title}" failed. Please try again.`,
      { link: `/courses/${payment.course.slug}` }
    );

    return next(ApiError.badRequest('Payment was not successful'));
  }

  // Update payment
  payment.status = 'completed';
  payment.gatewayTransactionId = paymentIntent.id;
  payment.gatewayResponse = paymentIntent;
  payment.paidAt = new Date();
  await payment.save();

  // Create enrollment
  const enrollment = await createPaidEnrollment(
    req.user._id,
    payment.course._id,
    payment._id,
    payment.amount.final
  );

  // Update instructor earnings
  await InstructorProfile.findOneAndUpdate(
    { user: payment.instructor },
    {
      $inc: {
        totalEarnings: payment.revenue.instructorEarnings,
        pendingPayout: payment.revenue.instructorEarnings
      }
    }
  );

  // Send confirmation email
  const emailContent = emailTemplates.enrollmentConfirmation(
    req.user.name,
    payment.course.title,
    payment.instructor.name
  );

  await sendEmail({
    to: req.user.email,
    subject: emailContent.subject,
    html: emailContent.html
  });

  // Notify user
  await Notification.createNotification(
    req.user._id,
    'payment_success',
    'Payment Successful! 🎉',
    `You're now enrolled in "${payment.course.title}"`,
    { 
      courseId: payment.course._id, 
      paymentId: payment._id,
      link: `/learn/${payment.course.slug}` 
    }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'payment_completed',
    category: 'payment',
    description: `Payment completed for ${payment.course.title}`,
    resourceType: 'payment',
    resourceId: payment._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, {
    payment,
    enrollment
  }, 'Payment successful');
});

/**
 * @desc    Get user's orders
 * @route   GET /api/v1/payments/my-orders
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: req.user._id };
  if (status) query.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Payment.find(query)
      .populate('course', 'title slug thumbnail')
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, orders, pagination);
});

/**
 * @desc    Get order details
 * @route   GET /api/v1/payments/:orderId
 * @access  Private
 */
const getOrder = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findOne({ orderId: req.params.orderId })
    .populate('course', 'title slug thumbnail')
    .populate('instructor', 'name')
    .populate('user', 'name email');

  if (!payment) {
    return next(ApiError.notFound('Order not found'));
  }

  // Check authorization
  if (payment.user._id.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  return ApiResponse.success(res, { order: payment });
});

/**
 * @desc    Request refund
 * @route   POST /api/v1/payments/:orderId/refund-request
 * @access  Private
 */
const requestRefund = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const payment = await Payment.findOne({ orderId: req.params.orderId })
    .populate('course', 'title');

  if (!payment) {
    return next(ApiError.notFound('Order not found'));
  }

  if (payment.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (payment.status !== 'completed') {
    return next(ApiError.badRequest('Cannot refund this order'));
  }

  // Check refund eligibility (e.g., 7-day window)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (payment.paidAt < sevenDaysAgo) {
    return next(ApiError.badRequest('Refund window has expired (7 days)'));
  }

  // Check completion percentage
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: payment.course._id
  });

  if (enrollment && enrollment.progress.percentComplete > 20) {
    return next(ApiError.badRequest('Cannot refund after completing more than 20% of the course'));
  }

  // Create refund request (admin will process)
  payment.refund.refundReason = reason;
  payment.status = 'processing'; // Mark for admin review
  await payment.save();

  // Notify admins
  const admins = await require('../models/User').find({ role: 'admin' });
  for (const admin of admins) {
    await Notification.createNotification(
      admin._id,
      'system',
      'New Refund Request',
      `Refund request for "${payment.course.title}" - ${payment.orderId}`,
      { link: `/admin/payments/${payment.orderId}` }
    );
  }

  return ApiResponse.success(res, { payment }, 'Refund request submitted');
});

/**
 * @desc    Process refund (Admin)
 * @route   PUT /api/v1/payments/:orderId/process-refund
 * @access  Private/Admin
 */
const processRefund = asyncHandler(async (req, res, next) => {
  const { action, amount } = req.body;

  const payment = await Payment.findOne({ orderId: req.params.orderId })
    .populate('user', 'name email')
    .populate('course', 'title');

  if (!payment) {
    return next(ApiError.notFound('Order not found'));
  }

  if (action === 'approve') {
    const refundAmount = amount || payment.amount.final;

    // Process Stripe refund
    if (payment.gatewayTransactionId) {
      await stripe.refunds.create({
        payment_intent: payment.gatewayTransactionId,
        amount: Math.round(refundAmount * 100)
      });
    }

    // Update payment
    await payment.processRefund(refundAmount, payment.refund.refundReason, req.user._id);

    // Update enrollment
    await Enrollment.findOneAndUpdate(
      { user: payment.user._id, course: payment.course._id },
      { status: 'refunded' }
    );

    // Update course stats
    await Course.findByIdAndUpdate(payment.course._id, {
      $inc: { 
        enrollmentCount: -1,
        totalRevenue: -refundAmount
      }
    });

    // Update instructor earnings
    const revenueToDeduct = (refundAmount * (100 - payment.revenue.commissionRate)) / 100;
    await InstructorProfile.findOneAndUpdate(
      { user: payment.instructor },
      {
        $inc: {
          totalEarnings: -revenueToDeduct,
          pendingPayout: -revenueToDeduct
        }
      }
    );

    // Notify user
    await Notification.createNotification(
      payment.user._id,
      'refund_processed',
      'Refund Processed',
      `Your refund of ₹${refundAmount} for "${payment.course.title}" has been processed.`,
      { link: '/my-orders' }
    );

    await AuditLog.log({
      userId: req.user._id,
      action: 'refund_completed',
      category: 'payment',
      description: `Refund processed: ${payment.orderId} - ₹${refundAmount}`,
      resourceType: 'payment',
      resourceId: payment._id,
      ipAddress: req.ip
    });

    return ApiResponse.success(res, { payment }, 'Refund processed');
  } else {
    payment.status = 'completed'; // Restore original status
    payment.refund.refundReason = null;
    await payment.save();

    await Notification.createNotification(
      payment.user._id,
      'system',
      'Refund Request Declined',
      `Your refund request for "${payment.course.title}" has been declined.`,
      { link: '/my-orders' }
    );

    return ApiResponse.success(res, { payment }, 'Refund request declined');
  }
});

/**
 * @desc    Get instructor earnings
 * @route   GET /api/v1/payments/instructor/earnings
 * @access  Private/Instructor
 */
const getInstructorEarnings = asyncHandler(async (req, res, next) => {
  const { period = 'all' } = req.query;

  let dateFilter = {};
  const now = new Date();

  switch (period) {
    case 'today':
      dateFilter = { 
        paidAt: { 
          $gte: new Date(now.setHours(0, 0, 0, 0)) 
        } 
      };
      break;
    case 'week': {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { paidAt: { $gte: weekAgo } };
      break;
    }
    case 'month': {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { paidAt: { $gte: monthAgo } };
      break;
    }
    case 'year': {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dateFilter = { paidAt: { $gte: yearAgo } };
      break;
    }
  }

  const stats = await Payment.aggregate([
    {
      $match: {
        instructor: req.user._id,
        status: 'completed',
        ...dateFilter
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$amount.final' },
        totalEarnings: { $sum: '$revenue.instructorEarnings' },
        platformCommission: { $sum: '$revenue.platformCommission' },
        transactionCount: { $sum: 1 }
      }
    }
  ]);

  // Monthly breakdown
  const monthlyData = await Payment.aggregate([
    {
      $match: {
        instructor: req.user._id,
        status: 'completed',
        paidAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' }
        },
        earnings: { $sum: '$revenue.instructorEarnings' },
        sales: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Course-wise earnings
  const courseEarnings = await Payment.aggregate([
    {
      $match: {
        instructor: req.user._id,
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$course',
        earnings: { $sum: '$revenue.instructorEarnings' },
        sales: { $sum: 1 }
      }
    },
    { $sort: { earnings: -1 } },
    { $limit: 10 }
  ]);

  // Populate course details
  const Course = require('../models/Course');
  for (let item of courseEarnings) {
    const course = await Course.findById(item._id).select('title slug');
    item.course = course;
  }

  const instructorProfile = await InstructorProfile.findOne({ user: req.user._id });

  return ApiResponse.success(res, {
    summary: stats[0] || {
      totalSales: 0,
      totalEarnings: 0,
      platformCommission: 0,
      transactionCount: 0
    },
    pendingPayout: instructorProfile?.pendingPayout || 0,
    totalEarnings: instructorProfile?.totalEarnings || 0,
    monthlyData,
    courseEarnings
  });
});

/**
 * @desc    Get all payments (Admin)
 * @route   GET /api/v1/payments/admin/all
 * @access  Private/Admin
 */
const getAllPayments = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, status, search, startDate, endDate } = req.query;

  const query = {};
  if (status) query.status = status;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { 'billing.email': { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('user', 'name email')
      .populate('course', 'title')
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, payments, pagination);
});

/**
 * @desc    Get revenue analytics (Admin)
 * @route   GET /api/v1/payments/admin/analytics
 * @access  Private/Admin
 */
const getRevenueAnalytics = asyncHandler(async (req, res, next) => {
  const overview = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount.final' },
        platformEarnings: { $sum: '$revenue.platformCommission' },
        instructorPayouts: { $sum: '$revenue.instructorEarnings' },
        totalOrders: { $sum: 1 },
        refundedAmount: {
          $sum: {
            $cond: ['$refund.isRefunded', '$refund.refundedAmount', 0]
          }
        }
      }
    }
  ]);

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paidAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 12)) }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' }
        },
        revenue: { $sum: '$amount.final' },
        platformEarnings: { $sum: '$revenue.platformCommission' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const topCourses = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$course',
        revenue: { $sum: '$amount.final' },
        sales: { $sum: 1 }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  // Populate course details
  for (let item of topCourses) {
    const course = await Course.findById(item._id).select('title slug thumbnail');
    item.course = course;
  }

  const topInstructors = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$instructor',
        revenue: { $sum: '$revenue.instructorEarnings' },
        sales: { $sum: 1 }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);

  // Populate instructor details
  const User = require('../models/User');
  for (let item of topInstructors) {
    const user = await User.findById(item._id).select('name email avatar');
    item.instructor = user;
  }

  return ApiResponse.success(res, {
    overview: overview[0] || {
      totalRevenue: 0,
      platformEarnings: 0,
      instructorPayouts: 0,
      totalOrders: 0,
      refundedAmount: 0
    },
    monthlyRevenue,
    topCourses,
    topInstructors
  });
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/v1/payments/webhook
 * @access  Public
 */
const handleWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      // Payment is handled in confirmPayment
      break;
    }
    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      await Payment.findOneAndUpdate(
        { gatewayOrderId: failedPayment.id },
        { status: 'failed', gatewayResponse: failedPayment }
      );
      break;
    }
    case 'charge.refunded': {
      // Handle refund webhook if needed
      break;
    }
  }

  res.json({ received: true });
});

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getMyOrders,
  getOrder,
  requestRefund,
  processRefund,
  getInstructorEarnings,
  getAllPayments,
  getRevenueAnalytics,
  handleWebhook
};
