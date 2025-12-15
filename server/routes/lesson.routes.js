const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  createLesson,
  getLessonsByCourse,
} = require("../controllers/lesson.controller");

// Instructor adds lesson
router.post(
  "/:courseId",
  protect,
  authorizeRoles("instructor", "admin"),
  createLesson
);

// Public (later restrict per enrollment)
router.get("/:courseId", getLessonsByCourse);

module.exports = router;
