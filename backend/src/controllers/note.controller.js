const Note = require('../models/Note');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { buildPaginationInfo } = require('../utils/helpers');

/**
 * @desc    Create a note
 * @route   POST /api/v1/notes
 * @access  Private
 */
const createNote = asyncHandler(async (req, res, next) => {
  const { lessonId, title, content, timestamp, color, tags } = req.body;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(ApiError.notFound('Lesson not found'));
  }

  // Verify enrollment
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: lesson.course,
    status: { $in: ['active', 'completed'] }
  });

  if (!enrollment) {
    return next(ApiError.forbidden('You must be enrolled to create notes'));
  }

  const note = await Note.create({
    user: req.user._id,
    course: lesson.course,
    lesson: lessonId,
    enrollment: enrollment._id,
    title,
    content,
    timestamp,
    color,
    tags
  });

  // Add note reference to enrollment
  enrollment.notes.push(note._id);
  await enrollment.save();

  return ApiResponse.created(res, { note }, 'Note created successfully');
});

/**
 * @desc    Get user's notes
 * @route   GET /api/v1/notes
 * @access  Private
 */
const getNotes = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, courseId, lessonId, search, sortBy = 'newest' } = req.query;

  const query = { user: req.user._id };

  if (courseId) query.course = courseId;
  if (lessonId) query.lesson = lessonId;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  let sortOption = {};
  switch (sortBy) {
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'updated':
      sortOption = { updatedAt: -1 };
      break;
    case 'pinned':
      sortOption = { isPinned: -1, createdAt: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [notes, total] = await Promise.all([
    Note.find(query)
      .populate('course', 'title slug')
      .populate('lesson', 'title')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Note.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, notes, pagination);
});

/**
 * @desc    Get single note
 * @route   GET /api/v1/notes/:id
 * @access  Private
 */
const getNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id)
    .populate('course', 'title slug')
    .populate('lesson', 'title');

  if (!note) {
    return next(ApiError.notFound('Note not found'));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  return ApiResponse.success(res, { note });
});

/**
 * @desc    Update note
 * @route   PUT /api/v1/notes/:id
 * @access  Private
 */
const updateNote = asyncHandler(async (req, res, next) => {
  const { title, content, timestamp, color, tags, isPinned } = req.body;

  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(ApiError.notFound('Note not found'));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      title,
      content,
      timestamp,
      color,
      tags,
      isPinned
    },
    { new: true, runValidators: true }
  ).populate('course', 'title slug')
   .populate('lesson', 'title');

  return ApiResponse.success(res, { note }, 'Note updated');
});

/**
 * @desc    Delete note
 * @route   DELETE /api/v1/notes/:id
 * @access  Private
 */
const deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(ApiError.notFound('Note not found'));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Remove from enrollment
  await Enrollment.findByIdAndUpdate(note.enrollment, {
    $pull: { notes: note._id }
  });

  await note.deleteOne();

  return ApiResponse.success(res, null, 'Note deleted');
});

/**
 * @desc    Get notes for a lesson
 * @route   GET /api/v1/notes/lesson/:lessonId
 * @access  Private
 */
const getLessonNotes = asyncHandler(async (req, res, next) => {
  const notes = await Note.find({
    user: req.user._id,
    lesson: req.params.lessonId
  }).sort({ timestamp: 1, createdAt: -1 });

  return ApiResponse.success(res, { notes });
});

/**
 * @desc    Toggle pin status
 * @route   PUT /api/v1/notes/:id/pin
 * @access  Private
 */
const togglePin = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(ApiError.notFound('Note not found'));
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return next(ApiError.forbidden('Not authorized'));
  }

  note.isPinned = !note.isPinned;
  await note.save();

  return ApiResponse.success(res, { note }, `Note ${note.isPinned ? 'pinned' : 'unpinned'}`);
});

/**
 * @desc    Export notes
 * @route   GET /api/v1/notes/export
 * @access  Private
 */
const exportNotes = asyncHandler(async (req, res, next) => {
  const { courseId, format = 'json' } = req.query;

  const query = { user: req.user._id };
  if (courseId) query.course = courseId;

  const notes = await Note.find(query)
    .populate('course', 'title')
    .populate('lesson', 'title')
    .sort({ course: 1, lesson: 1, timestamp: 1 });

  if (format === 'json') {
    return ApiResponse.success(res, { notes });
  }

  // Format as text
  let textContent = '';
  let currentCourse = '';
  let currentLesson = '';

  notes.forEach(note => {
    if (note.course.title !== currentCourse) {
      currentCourse = note.course.title;
      textContent += `\n\n==================\n${currentCourse}\n==================\n`;
    }

    if (note.lesson.title !== currentLesson) {
      currentLesson = note.lesson.title;
      textContent += `\n--- ${currentLesson} ---\n`;
    }

    textContent += `\n[${note.timestamp ? formatTimestamp(note.timestamp) : 'General'}]`;
    if (note.title) textContent += ` ${note.title}`;
    textContent += `\n${note.content}\n`;
  });

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=notes.txt');
  res.send(textContent);
});

// Helper function
function formatTimestamp(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getLessonNotes,
  togglePin,
  exportNotes
};
