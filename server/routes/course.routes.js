const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  togglePublish,
} = require("../controllers/course.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router
  .route("/")
  .get(getAllCourses)
  .post(protect, authorize("instructor", "admin"), createCourse);

router.get(
  "/instructor/mycourses",
  protect,
  authorize("instructor", "admin"),
  getInstructorCourses
);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("instructor", "admin"), updateCourse)
  .delete(protect, authorize("instructor", "admin"), deleteCourse);

router.put(
  "/:id/publish",
  protect,
  authorize("instructor", "admin"),
  togglePublish
);

module.exports = router;
