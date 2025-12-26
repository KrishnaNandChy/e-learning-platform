const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  getEnrollment,
  completeLesson,
} = require("../controllers/enrollment.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:courseId", protect, enrollCourse);
router.get("/", protect, getMyEnrollments);
router.get("/:id", protect, getEnrollment);
router.put("/:id/lessons/:lessonId/complete", protect, completeLesson);

module.exports = router;
