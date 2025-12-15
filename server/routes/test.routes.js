const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

/**
 * @desc    Any logged-in user can access
 * @route   GET /api/test/protected
 */
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are logged in!",
    user: req.user,
  });
});

/**
 * @desc    Only admin can access
 * @route   GET /api/test/admin
 */
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin!",
    user: req.user,
  });
});

/**
 * @desc    Only instructor can access
 * @route   GET /api/test/instructor
 */
router.get("/instructor", protect, authorizeRoles("instructor"), (req, res) => {
  res.json({
    message: "Welcome Instructor!",
    user: req.user,
  });
});

module.exports = router;
