const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const logger = require('../utils/logger');

/**
 * @desc    Create lesson
 * @route   POST /api/v1/courses/:courseId/lessons
 * @access  Private/Instructor
 */
const createLesson = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const {
    title,
    sectionIndex,
    type,
    description,
    isFreePreview,
    notes
  } = req.body;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!course.curriculum[sectionIndex]) {
    return next(ApiError.badRequest('Invalid section index'));
  }

  // Get order (position in section)
  const order = course.curriculum[sectionIndex].lessons.length;

  // Create lesson
  const lesson = await Lesson.create({
    title,
    course: courseId,
    sectionIndex,
    order,
    type: type || 'video',
    description,
    isFreePreview,
    notes
  });

  // Add lesson to course curriculum
  course.curriculum[sectionIndex].lessons.push(lesson._id);
  course.totalLessons += 1;
  await course.save();

  return ApiResponse.created(res, { lesson }, 'Lesson created successfully');
});

/**
 * @desc    Get lesson
 * @route   GET /api/v1/lessons/:id
 * @access  Private (Enrolled students or Instructor)
 */
const getLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('course', 'title slug instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  const course = lesson.course;

  // Check access
  const isInstructor = course.instructor.toString() === req.user._id.toString();
  const isAdmin = ['admin', 'admin_helper'].includes(req.user.role);

  if (!isInstructor && !isAdmin) {
    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
      status: { $in: ['active', 'completed'] }
    });

    if (!enrollment && !lesson.isFreePreview) {
      return next(ApiError.forbidden('You must be enrolled to access this lesson'));
    }
  }

  // Get progress if enrolled
  let progress = null;
  if (req.user) {
    progress = await Progress.findOne({
      user: req.user._id,
      lesson: lesson._id
    });
  }

  return ApiResponse.success(res, { lesson, progress });
});

/**
 * @desc    Update lesson
 * @route   PUT /api/v1/lessons/:id
 * @access  Private/Instructor
 */
const updateLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  if (lesson.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const allowedFields = [
    'title', 'description', 'type', 'content', 'isFreePreview',
    'isPublished', 'minimumWatchPercentage', 'notes', 'transcription'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  return ApiResponse.success(res, { lesson }, 'Lesson updated successfully');
});

/**
 * @desc    Upload lesson video
 * @route   PUT /api/v1/lessons/:id/video
 * @access  Private/Instructor
 */
const uploadVideo = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  if (lesson.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!req.file) {
    return next(ApiError.badRequest('Please upload a video'));
  }

  // Delete old video if exists
  if (lesson.content.video && lesson.content.video.public_id) {
    await deleteFromCloudinary(lesson.content.video.public_id, 'video');
  }

  // Upload to cloudinary
  const result = await uploadToCloudinary(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
    'lessons',
    'video'
  );

  lesson.content.video = {
    public_id: result.public_id,
    url: result.url,
    duration: result.duration
  };
  lesson.duration = result.duration || 0;
  lesson.type = 'video';
  await lesson.save();

  // Update course total duration
  await updateCourseDuration(lesson.course._id);

  return ApiResponse.success(res, { video: lesson.content.video }, 'Video uploaded successfully');
});

/**
 * @desc    Add resource to lesson
 * @route   POST /api/v1/lessons/:id/resources
 * @access  Private/Instructor
 */
const addResource = asyncHandler(async (req, res, next) => {
  const { title, type, url, downloadable } = req.body;

  const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  if (lesson.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  let resourceData = { title, type, downloadable };

  if (req.file) {
    // Upload file
    const result = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      'resources',
      'raw'
    );
    resourceData.url = result.url;
    resourceData.public_id = result.public_id;
    resourceData.size = result.size;
  } else if (url) {
    resourceData.url = url;
  } else {
    return next(ApiError.badRequest('Please provide a file or URL'));
  }

  lesson.resources.push(resourceData);
  await lesson.save();

  return ApiResponse.success(res, { resources: lesson.resources }, 'Resource added');
});

/**
 * @desc    Delete resource from lesson
 * @route   DELETE /api/v1/lessons/:id/resources/:resourceId
 * @access  Private/Instructor
 */
const deleteResource = asyncHandler(async (req, res, next) => {
  const { id, resourceId } = req.params;

  const lesson = await Lesson.findById(id).populate('course', 'instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  if (lesson.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  const resource = lesson.resources.id(resourceId);
  if (!resource) {
    return next(ApiError.notFound('Resource not found'));
  }

  // Delete from cloudinary if applicable
  if (resource.public_id) {
    await deleteFromCloudinary(resource.public_id, 'raw');
  }

  resource.deleteOne();
  await lesson.save();

  return ApiResponse.success(res, null, 'Resource deleted');
});

/**
 * @desc    Delete lesson
 * @route   DELETE /api/v1/lessons/:id
 * @access  Private/Instructor
 */
const deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id).populate('course', 'instructor');

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  if (lesson.course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Delete video from cloudinary
  if (lesson.content.video && lesson.content.video.public_id) {
    await deleteFromCloudinary(lesson.content.video.public_id, 'video');
  }

  // Delete resources from cloudinary
  for (const resource of lesson.resources) {
    if (resource.public_id) {
      await deleteFromCloudinary(resource.public_id, 'raw');
    }
  }

  // Remove from course curriculum
  const course = await Course.findById(lesson.course._id);
  if (course && course.curriculum[lesson.sectionIndex]) {
    course.curriculum[lesson.sectionIndex].lessons = 
      course.curriculum[lesson.sectionIndex].lessons.filter(
        l => l.toString() !== lesson._id.toString()
      );
    course.totalLessons = Math.max(0, course.totalLessons - 1);
    await course.save();
  }

  // Delete progress records
  await Progress.deleteMany({ lesson: lesson._id });

  await lesson.deleteOne();

  // Update course duration
  await updateCourseDuration(lesson.course._id);

  return ApiResponse.success(res, null, 'Lesson deleted');
});

/**
 * @desc    Reorder lessons
 * @route   PUT /api/v1/courses/:courseId/lessons/reorder
 * @access  Private/Instructor
 */
const reorderLessons = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { lessons } = req.body; // Array of { lessonId, sectionIndex, order }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(ApiError.notFound('Course not found'));
  }

  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Update each lesson
  for (const item of lessons) {
    await Lesson.findByIdAndUpdate(item.lessonId, {
      sectionIndex: item.sectionIndex,
      order: item.order
    });
  }

  // Rebuild curriculum
  const allLessons = await Lesson.find({ course: courseId }).sort({ sectionIndex: 1, order: 1 });

  course.curriculum.forEach((section, index) => {
    section.lessons = allLessons
      .filter(l => l.sectionIndex === index)
      .map(l => l._id);
  });

  await course.save();

  return ApiResponse.success(res, { course }, 'Lessons reordered');
});

/**
 * @desc    Update progress
 * @route   PUT /api/v1/lessons/:id/progress
 * @access  Private
 */
const updateProgress = asyncHandler(async (req, res, next) => {
  const { watchedDuration, lastPosition, totalDuration } = req.body;

  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  // Get enrollment
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: lesson.course,
    status: { $in: ['active', 'completed'] }
  });

  if (!enrollment) {
    return next(ApiError.forbidden('Not enrolled in this course'));
  }

  // Find or create progress
  let progress = await Progress.findOne({
    user: req.user._id,
    lesson: lesson._id
  });

  if (!progress) {
    progress = new Progress({
      user: req.user._id,
      course: lesson.course,
      lesson: lesson._id,
      enrollment: enrollment._id,
      totalDuration: totalDuration || lesson.duration
    });
  }

  // Add watch segment
  const startTime = Math.max(0, lastPosition - 10); // 10 seconds buffer
  await progress.addWatchSegment(startTime, lastPosition);

  // Update enrollment progress
  if (progress.isCompleted && !enrollment.progress.completedLessons.includes(lesson._id)) {
    await enrollment.markLessonComplete(lesson._id);
  }

  enrollment.progress.lastAccessedAt = new Date();
  enrollment.progress.currentLesson = lesson._id;
  await enrollment.save();

  return ApiResponse.success(res, { progress, enrollment }, 'Progress updated');
});

/**
 * @desc    Mark lesson as complete
 * @route   PUT /api/v1/lessons/:id/complete
 * @access  Private
 */
const markComplete = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: lesson.course,
    status: { $in: ['active', 'completed'] }
  });

  if (!enrollment) {
    return next(ApiError.forbidden('Not enrolled in this course'));
  }

  // Update or create progress
  let progress = await Progress.findOne({
    user: req.user._id,
    lesson: lesson._id
  });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: lesson.course,
      lesson: lesson._id,
      enrollment: enrollment._id,
      isCompleted: true,
      completedAt: new Date(),
      watchPercentage: 100
    });
  } else {
    progress.isCompleted = true;
    progress.completedAt = new Date();
    progress.watchPercentage = 100;
    await progress.save();
  }

  // Update enrollment
  await enrollment.markLessonComplete(lesson._id);

  return ApiResponse.success(res, { progress, enrollment }, 'Lesson marked as complete');
});

// Helper function to update course total duration
async function updateCourseDuration(courseId) {
  const lessons = await Lesson.find({ course: courseId });
  const totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);

  await Course.findByIdAndUpdate(courseId, { totalDuration });
}

module.exports = {
  createLesson,
  getLesson,
  updateLesson,
  uploadVideo,
  addResource,
  deleteResource,
  deleteLesson,
  reorderLessons,
  updateProgress,
  markComplete
};
