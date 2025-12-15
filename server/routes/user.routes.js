const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { getMyCourses } = require("../controllers/user.controller");

router.get("/me/courses", protect, authorizeRoles("student"), getMyCourses);

module.exports = router;
