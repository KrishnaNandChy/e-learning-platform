const User = require("../models/User.model");

/**
 * @desc    Get logged-in student's enrolled courses
 * @route   GET /api/users/me/courses
 * @access  Student
 */
exports.getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrolled courses" });
  }
};
