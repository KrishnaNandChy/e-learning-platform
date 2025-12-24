const express = require("express");
const router = express.Router();
const Category = require("../models/Category.model");
const { protect, authorize } = require("../middleware/auth.middleware");

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .select("name slug icon color courseCount");

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
});

// Create category (Admin only)
router.post("/", protect, authorize("admin"), async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
