const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  createCourse,
  getCourses,
  getCourseById,
  publishCourse,
  enrollCourse,
  getMyCourses,
} = require("../controllers/course.controller");

// ---------- PUBLIC ----------
router.get("/", getCourses);

// ---------- PROTECTED ----------
router.get("/my", protect, authorizeRoles("instructor", "admin"), getMyCourses);

router.post("/", protect, authorizeRoles("instructor", "admin"), createCourse);

router.put(
  "/:id/publish",
  protect,
  authorizeRoles("instructor", "admin"),
  publishCourse
);

router.post("/:id/enroll", protect, authorizeRoles("student"), enrollCourse);

// ---------- PUBLIC ----------
router.get("/:id", getCourseById);

module.exports = router;
