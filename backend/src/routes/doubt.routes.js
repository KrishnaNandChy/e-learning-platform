const express = require('express');
const router = express.Router();
const {
  createDoubt,
  getDoubts,
  getDoubt,
  replyToDoubt,
  resolveDoubt,
  acceptAnswer,
  upvoteDoubt,
  flagDoubt,
  deleteDoubt,
  getInstructorDoubts,
  getAllDoubts
} = require('../controllers/doubt.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', createDoubt);
router.get('/', getDoubts);
router.get('/:id', validateObjectId('id'), getDoubt);
router.post('/:id/reply', validateObjectId('id'), replyToDoubt);
router.put('/:id/resolve', validateObjectId('id'), resolveDoubt);
router.put('/:id/replies/:replyId/accept', validateObjectId('id'), acceptAnswer);
router.put('/:id/upvote', validateObjectId('id'), upvoteDoubt);
router.delete('/:id', validateObjectId('id'), deleteDoubt);

// Instructor routes
router.get('/instructor/pending', authorize('instructor'), getInstructorDoubts);

// Admin routes
router.get('/admin/all', authorize('admin', 'admin_helper'), getAllDoubts);
router.put('/:id/flag', authorize('admin', 'admin_helper'), validateObjectId('id'), flagDoubt);

module.exports = router;
