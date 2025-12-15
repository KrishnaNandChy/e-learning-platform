const Lesson = require("../models/Lesson.model");
const Course = require("../models/Course.model");

// Create lesson (Instructor only)
exports.createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, order, isFreePreview } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Ensure instructor owns the course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const lesson = await Lesson.create({
      title,
      description,
      videoUrl,
      order,
      isFreePreview,
      course: courseId,
    });

    course.lessons.push(lesson._id);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Lesson creation failed" });
  }
};

// Get lessons by course
exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};
