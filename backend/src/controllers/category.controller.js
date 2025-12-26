const Category = require('../models/Category');
const Course = require('../models/Course');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res, next) => {
  const { includeSubcategories = true, activeOnly = true } = req.query;

  const query = { parent: null };
  if (activeOnly === 'true') {
    query.isActive = true;
  }

  let categories = await Category.find(query)
    .sort({ order: 1, name: 1 });

  if (includeSubcategories === 'true') {
    categories = await Category.find(query)
      .populate({
        path: 'subcategories',
        match: activeOnly === 'true' ? { isActive: true } : {},
        options: { sort: { order: 1, name: 1 } }
      })
      .sort({ order: 1, name: 1 });
  }

  return ApiResponse.success(res, { categories });
});

/**
 * @desc    Get single category
 * @route   GET /api/v1/categories/:slug
 * @access  Public
 */
const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug })
    .populate({
      path: 'subcategories',
      match: { isActive: true },
      options: { sort: { order: 1, name: 1 } }
    });

  if (!category) {
    return next(ApiError.notFound('Category not found'));
  }

  // Get course count for this category and its subcategories
  const subcategoryIds = category.subcategories?.map(s => s._id) || [];
  const courseCount = await Course.countDocuments({
    $or: [
      { category: category._id },
      { subcategory: { $in: subcategoryIds } }
    ],
    status: 'published',
    isApproved: true
  });

  return ApiResponse.success(res, { 
    category,
    courseCount
  });
});

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, icon, parent, order } = req.body;

  // Check if parent exists
  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return next(ApiError.badRequest('Parent category not found'));
    }
  }

  const category = await Category.create({
    name,
    description,
    icon,
    parent,
    order
  });

  await AuditLog.log({
    userId: req.user._id,
    action: 'category_created',
    category: 'admin',
    description: `Category created: ${name}`,
    resourceType: 'category',
    resourceId: category._id,
    ipAddress: req.ip
  });

  return ApiResponse.created(res, { category }, 'Category created successfully');
});

/**
 * @desc    Update category
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description, icon, isActive, order } = req.body;

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(ApiError.notFound('Category not found'));
  }

  const previousData = category.toObject();

  category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description, icon, isActive, order },
    { new: true, runValidators: true }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'category_updated',
    category: 'admin',
    description: `Category updated: ${category.name}`,
    resourceType: 'category',
    resourceId: category._id,
    previousData,
    newData: { name, description, icon, isActive, order },
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { category }, 'Category updated');
});

/**
 * @desc    Upload category image
 * @route   PUT /api/v1/categories/:id/image
 * @access  Private/Admin
 */
const uploadCategoryImage = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(ApiError.notFound('Category not found'));
  }

  if (!req.file) {
    return next(ApiError.badRequest('Please upload an image'));
  }

  // Delete old image
  if (category.image && category.image.public_id) {
    await deleteFromCloudinary(category.image.public_id);
  }

  // Upload new image
  const result = await uploadToCloudinary(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
    'categories',
    'image'
  );

  category.image = {
    public_id: result.public_id,
    url: result.url
  };
  await category.save();

  return ApiResponse.success(res, { category }, 'Image uploaded');
});

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(ApiError.notFound('Category not found'));
  }

  // Check if category has courses
  const courseCount = await Course.countDocuments({ 
    $or: [
      { category: category._id },
      { subcategory: category._id }
    ]
  });

  if (courseCount > 0) {
    return next(ApiError.badRequest('Cannot delete category with existing courses'));
  }

  // Check if category has subcategories
  const subcategoryCount = await Category.countDocuments({ parent: category._id });
  if (subcategoryCount > 0) {
    return next(ApiError.badRequest('Cannot delete category with subcategories'));
  }

  // Delete image
  if (category.image && category.image.public_id) {
    await deleteFromCloudinary(category.image.public_id);
  }

  await category.deleteOne();

  await AuditLog.log({
    userId: req.user._id,
    action: 'category_deleted',
    category: 'admin',
    description: `Category deleted: ${category.name}`,
    resourceType: 'category',
    resourceId: category._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, null, 'Category deleted');
});

/**
 * @desc    Get category stats
 * @route   GET /api/v1/categories/stats
 * @access  Private/Admin
 */
const getCategoryStats = asyncHandler(async (req, res, next) => {
  const stats = await Category.aggregate([
    { $match: { parent: null } },
    {
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'category',
        as: 'courses'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        courseCount: { $size: '$courses' },
        totalEnrollments: { $sum: '$courses.enrollmentCount' },
        avgRating: { $avg: '$courses.averageRating' }
      }
    },
    { $sort: { courseCount: -1 } }
  ]);

  return ApiResponse.success(res, { stats });
});

/**
 * @desc    Reorder categories
 * @route   PUT /api/v1/categories/reorder
 * @access  Private/Admin
 */
const reorderCategories = asyncHandler(async (req, res, next) => {
  const { categories } = req.body; // Array of { id, order }

  await Promise.all(
    categories.map(({ id, order }) =>
      Category.findByIdAndUpdate(id, { order })
    )
  );

  return ApiResponse.success(res, null, 'Categories reordered');
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  uploadCategoryImage,
  deleteCategory,
  getCategoryStats,
  reorderCategories
};
