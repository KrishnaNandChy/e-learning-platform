const Course = require("../models/Course.model");
const User = require("../models/User.model");

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Instructor only
 */
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Course creation failed" });
  }
};

/**
 * @desc    Get all published courses
 * @route   GET /api/courses
 * @access  Public
 */
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate(
      "instructor",
      "name"
    );

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/**
 * @desc    Get single course
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

/**
 * @desc    Get courses created by instructor
 * @route   GET /api/courses/my
 * @access  Instructor
 */
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch instructor courses" });
  }
};

/**
 * @desc    Enroll student in course
 * @route   POST /api/courses/:id/enroll
 * @access  Student only
 */
exports.enrollCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(userId);

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    user.enrolledCourses.push(courseId);
    course.enrolledStudents.push(userId);

    await user.save();
    await course.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};

/**
 * @desc    Publish course
 * @route   PUT /api/courses/:id/publish
 * @access  Instructor only
 */
exports.publishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = true;
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Publish failed" });
  }
};
