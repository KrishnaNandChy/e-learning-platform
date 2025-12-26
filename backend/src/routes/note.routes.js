const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getLessonNotes,
  togglePin,
  exportNotes
} = require('../controllers/note.controller');
const { authenticate } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', createNote);
router.get('/', getNotes);
router.get('/export', exportNotes);
router.get('/lesson/:lessonId', validateObjectId('lessonId'), getLessonNotes);
router.get('/:id', validateObjectId('id'), getNote);
router.put('/:id', validateObjectId('id'), updateNote);
router.put('/:id/pin', validateObjectId('id'), togglePin);
router.delete('/:id', validateObjectId('id'), deleteNote);

module.exports = router;
