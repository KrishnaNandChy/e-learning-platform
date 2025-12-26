const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  uploadCategoryImage,
  deleteCategory,
  getCategoryStats,
  reorderCategories
} = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');
const { processUpload } = require('../middlewares/upload');

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin routes
router.use(authenticate);
router.use(authorize('admin', 'admin_helper'));

router.get('/admin/stats', getCategoryStats);
router.post('/', createCategory);
router.put('/reorder', reorderCategories);
router.put('/:id', validateObjectId('id'), updateCategory);
router.put('/:id/image', validateObjectId('id'), processUpload('image'), uploadCategoryImage);
router.delete('/:id', validateObjectId('id'), deleteCategory);

module.exports = router;
