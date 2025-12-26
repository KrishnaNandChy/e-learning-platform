const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sectionIndex: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'quiz', 'assignment', 'resource'],
    default: 'video'
  },
  content: {
    // For video lessons
    video: {
      public_id: String,
      url: String,
      duration: Number, // in seconds
      quality: String
    },
    // For text lessons
    text: {
      type: String,
      maxlength: [50000, 'Content cannot exceed 50000 characters']
    },
    // For quiz lessons
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    }
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['pdf', 'ppt', 'doc', 'zip', 'link', 'other']
    },
    url: String,
    public_id: String,
    size: Number,
    downloadable: { type: Boolean, default: true }
  }],
  duration: {
    type: Number, // in seconds
    default: 0
  },
  isFreePreview: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  completionCriteria: {
    type: String,
    enum: ['video_watched', 'quiz_passed', 'manual', 'time_spent'],
    default: 'video_watched'
  },
  minimumWatchPercentage: {
    type: Number,
    default: 80,
    min: 0,
    max: 100
  },
  transcription: {
    type: String
  },
  captions: [{
    language: String,
    url: String
  }],
  notes: {
    type: String // Instructor notes
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
lessonSchema.index({ course: 1, sectionIndex: 1, order: 1 });
lessonSchema.index({ course: 1 });

// Virtual for formatted duration
lessonSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return '0:00';
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
