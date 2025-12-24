const Lesson = require('../models/Lesson.model');
const Course = require('../models/Course.model');

/**
 * @desc    Create a lesson
 * @route   POST /api/lessons/:courseId
 * @access  Private (Instructor/Admin)
 */
exports.createLesson = async (req, res) => {
  try {
    const { title, description, type, content, duration, order, isPreview, resources } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check ownership (instructor or admin)
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to add lessons to this course' 
      });
    }

    const lesson = await Lesson.create({
      title,
      description,
      course: courseId,
      type: type || 'video',
      content,
      duration,
      order: order || course.totalLessons + 1,
      isPreview: isPreview || false,
      resources,
    });

    // Update course lesson count
    course.totalLessons += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson,
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create lesson' 
    });
  }
};

/**
 * @desc    Get lessons for a course
 * @route   GET /api/lessons/:courseId
 * @access  Public (preview) / Private (full)
 */
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort({ order: 1 })
      .select('-content.articleContent -content.questions');

    res.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch lessons' 
    });
  }
};

/**
 * @desc    Get single lesson
 * @route   GET /api/lessons/single/:id
 * @access  Private (enrolled students)
 */
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Lesson not found' 
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch lesson' 
    });
  }
};

/**
 * @desc    Update lesson
 * @route   PUT /api/lessons/:id
 * @access  Private (Instructor/Admin)
 */
exports.updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Lesson not found' 
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this lesson' 
      });
    }

    lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson,
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update lesson' 
    });
  }
};

/**
 * @desc    Delete lesson
 * @route   DELETE /api/lessons/:id
 * @access  Private (Instructor/Admin)
 */
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Lesson not found' 
      });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this lesson' 
      });
    }

    // Update course lesson count
    await Course.findByIdAndUpdate(lesson.course._id, {
      $inc: { totalLessons: -1 },
    });

    await lesson.deleteOne();

    res.json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete lesson' 
    });
  }
};
