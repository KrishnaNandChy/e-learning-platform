const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ['video', 'article', 'quiz', 'assignment'],
      default: 'video',
    },
    content: {
      // For video
      videoUrl: String,
      videoDuration: String, // e.g., "10:30"
      // For article
      articleContent: String,
      // For quiz
      questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      }],
    },
    duration: {
      type: String,
      default: '0:00',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
    resources: [{
      title: String,
      type: String, // 'pdf', 'link', 'file'
      url: String,
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lesson', lessonSchema);
