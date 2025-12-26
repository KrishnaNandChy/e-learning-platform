const Doubt = require('../models/Doubt');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sendEmail, emailTemplates } = require('../config/email');
const { buildPaginationInfo } = require('../utils/helpers');

/**
 * @desc    Create a doubt
 * @route   POST /api/v1/doubts
 * @access  Private
 */
const createDoubt = asyncHandler(async (req, res, next) => {
  const { courseId, lessonId, title, description, category, videoTimestamp, attachments } = req.body;

  // Verify enrollment
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId,
    status: { $in: ['active', 'completed'] }
  });

  if (!enrollment) {
    return next(ApiError.forbidden('You must be enrolled to ask doubts'));
  }

  // Verify lesson belongs to course
  if (lessonId) {
    const lesson = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lesson) {
      return next(ApiError.badRequest('Invalid lesson'));
    }
  }

  const doubt = await Doubt.create({
    user: req.user._id,
    course: courseId,
    lesson: lessonId,
    enrollment: enrollment._id,
    title,
    description,
    category,
    videoTimestamp,
    attachments
  });

  // Notify instructor
  const course = await Course.findById(courseId).populate('instructor', 'email name');
  
  await Notification.createNotification(
    course.instructor._id,
    'doubt_reply',
    'New Question Posted',
    `A student asked: "${title.substring(0, 50)}..."`,
    { courseId, doubtId: doubt._id, link: `/instructor/doubts/${doubt._id}` }
  );

  return ApiResponse.created(res, { doubt }, 'Doubt posted successfully');
});

/**
 * @desc    Get doubts
 * @route   GET /api/v1/doubts
 * @access  Private
 */
const getDoubts = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    courseId, 
    lessonId, 
    status,
    category,
    myDoubts 
  } = req.query;

  const query = {};

  if (myDoubts === 'true') {
    query.user = req.user._id;
  }

  if (courseId) query.course = courseId;
  if (lessonId) query.lesson = lessonId;
  if (status) query.status = status;
  if (category) query.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [doubts, total] = await Promise.all([
    Doubt.find(query)
      .populate('user', 'name avatar')
      .populate('course', 'title slug')
      .populate('lesson', 'title')
      .populate('replies.responder', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Doubt.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, doubts, pagination);
});

/**
 * @desc    Get single doubt
 * @route   GET /api/v1/doubts/:id
 * @access  Private
 */
const getDoubt = asyncHandler(async (req, res, next) => {
  const doubt = await Doubt.findById(req.params.id)
    .populate('user', 'name avatar')
    .populate('course', 'title slug instructor')
    .populate('lesson', 'title')
    .populate('replies.responder', 'name avatar role');

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  // Increment views
  doubt.views += 1;
  await doubt.save();

  return ApiResponse.success(res, { doubt });
});

/**
 * @desc    Reply to a doubt
 * @route   POST /api/v1/doubts/:id/reply
 * @access  Private (Instructor/Admin/Student)
 */
const replyToDoubt = asyncHandler(async (req, res, next) => {
  const { content, attachments } = req.body;

  const doubt = await Doubt.findById(req.params.id)
    .populate('user', 'name email')
    .populate('course', 'title instructor')
    .populate('lesson', 'title');

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  const isInstructor = doubt.course.instructor.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  // Check if student is enrolled to reply
  if (!isInstructor && !isAdmin) {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: doubt.course._id,
      status: { $in: ['active', 'completed'] }
    });

    if (!enrollment) {
      return next(ApiError.forbidden('You must be enrolled to reply'));
    }
  }

  // Add reply
  await doubt.addReply(
    req.user,
    content,
    attachments,
    isInstructor,
    isAdmin
  );

  // Notify doubt creator if someone else replied
  if (doubt.user._id.toString() !== req.user._id.toString()) {
    await Notification.createNotification(
      doubt.user._id,
      'doubt_reply',
      'Your doubt has been answered!',
      `Someone replied to your question: "${doubt.title.substring(0, 50)}..."`,
      { 
        courseId: doubt.course._id, 
        doubtId: doubt._id, 
        link: `/doubts/${doubt._id}` 
      }
    );

    // Send email for instructor/admin replies
    if (isInstructor || isAdmin) {
      const emailContent = emailTemplates.doubtReply(
        doubt.user.name,
        doubt.course.title,
        doubt.lesson?.title || 'Course',
        req.user.name
      );

      await sendEmail({
        to: doubt.user.email,
        subject: emailContent.subject,
        html: emailContent.html
      });
    }
  }

  const updatedDoubt = await Doubt.findById(doubt._id)
    .populate('user', 'name avatar')
    .populate('replies.responder', 'name avatar role');

  return ApiResponse.success(res, { doubt: updatedDoubt }, 'Reply added');
});

/**
 * @desc    Mark doubt as resolved
 * @route   PUT /api/v1/doubts/:id/resolve
 * @access  Private
 */
const resolveDoubt = asyncHandler(async (req, res, next) => {
  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  // Only doubt creator, instructor, or admin can resolve
  const isOwner = doubt.user.toString() === req.user._id.toString();
  const course = await Course.findById(doubt.course);
  const isInstructor = course.instructor.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  if (!isOwner && !isInstructor && !isAdmin) {
    return next(ApiError.forbidden('Not authorized to resolve this doubt'));
  }

  await doubt.markResolved(req.user._id);

  return ApiResponse.success(res, { doubt }, 'Doubt marked as resolved');
});

/**
 * @desc    Accept an answer
 * @route   PUT /api/v1/doubts/:id/replies/:replyId/accept
 * @access  Private (Doubt creator only)
 */
const acceptAnswer = asyncHandler(async (req, res, next) => {
  const { id, replyId } = req.params;

  const doubt = await Doubt.findById(id);

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  if (doubt.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Only the question creator can accept an answer'));
  }

  const reply = doubt.replies.id(replyId);
  if (!reply) {
    return next(ApiError.notFound('Reply not found'));
  }

  // Unset previous accepted answers
  doubt.replies.forEach(r => {
    r.isAcceptedAnswer = false;
  });

  reply.isAcceptedAnswer = true;
  doubt.status = 'answered';
  await doubt.save();

  return ApiResponse.success(res, { doubt }, 'Answer accepted');
});

/**
 * @desc    Upvote doubt or reply
 * @route   PUT /api/v1/doubts/:id/upvote
 * @access  Private
 */
const upvoteDoubt = asyncHandler(async (req, res, next) => {
  const { replyId } = req.body;

  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  if (replyId) {
    // Upvote reply
    const reply = doubt.replies.id(replyId);
    if (!reply) {
      return next(ApiError.notFound('Reply not found'));
    }

    const index = reply.upvotes.indexOf(req.user._id);
    if (index > -1) {
      reply.upvotes.splice(index, 1);
    } else {
      reply.upvotes.push(req.user._id);
    }
  } else {
    // Upvote doubt
    const index = doubt.upvotes.indexOf(req.user._id);
    if (index > -1) {
      doubt.upvotes.splice(index, 1);
    } else {
      doubt.upvotes.push(req.user._id);
    }
  }

  await doubt.save();

  return ApiResponse.success(res, { doubt }, 'Vote recorded');
});

/**
 * @desc    Flag doubt
 * @route   PUT /api/v1/doubts/:id/flag
 * @access  Private/Admin
 */
const flagDoubt = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  doubt.isFlagged = true;
  doubt.flagReason = reason;
  doubt.flaggedBy = req.user._id;
  doubt.status = 'flagged';
  await doubt.save();

  return ApiResponse.success(res, { doubt }, 'Doubt flagged');
});

/**
 * @desc    Delete doubt
 * @route   DELETE /api/v1/doubts/:id
 * @access  Private
 */
const deleteDoubt = asyncHandler(async (req, res, next) => {
  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    return next(ApiError.notFound('Doubt not found'));
  }

  // Only creator or admin can delete
  const isOwner = doubt.user.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    return next(ApiError.forbidden('Not authorized'));
  }

  await doubt.deleteOne();

  return ApiResponse.success(res, null, 'Doubt deleted');
});

/**
 * @desc    Get instructor's doubts
 * @route   GET /api/v1/doubts/instructor/pending
 * @access  Private/Instructor
 */
const getInstructorDoubts = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, status = 'open' } = req.query;

  // Get instructor's courses
  const courses = await Course.find({ instructor: req.user._id }).select('_id');
  const courseIds = courses.map(c => c._id);

  const query = { 
    course: { $in: courseIds },
    status 
  };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [doubts, total] = await Promise.all([
    Doubt.find(query)
      .populate('user', 'name avatar')
      .populate('course', 'title')
      .populate('lesson', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Doubt.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, doubts, pagination);
});

/**
 * @desc    Get all doubts (Admin)
 * @route   GET /api/v1/doubts/admin/all
 * @access  Private/Admin
 */
const getAllDoubts = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    isFlagged,
    courseId 
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (isFlagged === 'true') query.isFlagged = true;
  if (courseId) query.course = courseId;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [doubts, total] = await Promise.all([
    Doubt.find(query)
      .populate('user', 'name email')
      .populate('course', 'title instructor')
      .populate('lesson', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Doubt.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, doubts, pagination);
});

module.exports = {
  createDoubt,
  getDoubts,
  getDoubt,
  replyToDoubt,
  resolveDoubt,
  acceptAnswer,
  upvoteDoubt,
  flagDoubt,
  deleteDoubt,
  getInstructorDoubts,
  getAllDoubts
};
