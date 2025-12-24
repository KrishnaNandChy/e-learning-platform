const express = require("express");
const router = express.Router();
const {
  createReview,
  getCourseReviews,
  markHelpful,
} = require("../controllers/review.controller");
const { protect, optionalAuth } = require("../middleware/auth.middleware");

router.post("/:courseId", protect, createReview);
router.get("/course/:courseId", optionalAuth, getCourseReviews);
router.put("/:id/helpful", protect, markHelpful);

module.exports = router;
