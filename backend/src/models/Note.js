const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [10000, 'Note content cannot exceed 10000 characters']
  },
  timestamp: {
    type: Number, // Video timestamp in seconds where note was taken
    default: 0
  },
  color: {
    type: String,
    enum: ['default', 'yellow', 'green', 'blue', 'pink', 'purple'],
    default: 'default'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
noteSchema.index({ user: 1, course: 1 });
noteSchema.index({ user: 1, lesson: 1 });
noteSchema.index({ enrollment: 1 });
noteSchema.index({ createdAt: -1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
