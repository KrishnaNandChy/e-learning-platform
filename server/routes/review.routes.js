const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  updateReview,
  deleteReview,
  markHelpful,
} = require('../controllers/review.controller');

router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

module.exports = router;
