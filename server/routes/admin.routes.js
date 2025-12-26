const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  toggleUserActive,
  deleteUser,
  getAllCoursesAdmin,
  toggleCourseFeatured,
  getPendingReviews,
  approveReview,
} = require("../controllers/admin.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Apply admin authentication to all routes
router.use(protect);
router.use(authorize("admin"));

// Dashboard
router.get("/stats", getDashboardStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/toggle-active", toggleUserActive);
router.delete("/users/:id", deleteUser);

// Courses
router.get("/courses", getAllCoursesAdmin);
router.put("/courses/:id/featured", toggleCourseFeatured);

// Reviews
router.get("/reviews/pending", getPendingReviews);
router.put("/reviews/:id/approve", approveReview);

module.exports = router;
