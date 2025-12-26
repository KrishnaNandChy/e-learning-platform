const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  enrollmentType: {
    type: String,
    enum: ['free', 'paid', 'gifted', 'promotional'],
    default: 'paid'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  pricePaid: {
    type: Number,
    default: 0
  },
  progress: {
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    currentLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    lastAccessedAt: Date,
    totalWatchTime: {
      type: Number, // in seconds
      default: 0
    },
    percentComplete: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'refunded', 'suspended'],
    default: 'active'
  },
  completedAt: Date,
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  rating: {
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    reviewedAt: Date
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  bookmarks: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    timestamp: Number,
    note: String,
    createdAt: { type: Date, default: Date.now }
  }],
  accessExpiry: Date, // For time-limited access
  isLifetimeAccess: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique enrollment
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ enrolledAt: -1 });

// Check if course is completed
enrollmentSchema.methods.checkCompletion = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course).populate('curriculum.lessons');
  
  if (!course) return false;
  
  const totalLessons = course.totalLessons;
  const completedCount = this.progress.completedLessons.length;
  
  this.progress.percentComplete = Math.round((completedCount / totalLessons) * 100);
  
  if (this.progress.percentComplete >= course.certificateCompletionThreshold) {
    this.status = 'completed';
    this.completedAt = new Date();
    return true;
  }
  
  return false;
};

// Mark lesson as complete
enrollmentSchema.methods.markLessonComplete = async function(lessonId) {
  if (!this.progress.completedLessons.includes(lessonId)) {
    this.progress.completedLessons.push(lessonId);
    await this.checkCompletion();
    await this.save();
  }
  return this;
};

// Update watch time
enrollmentSchema.methods.updateWatchTime = async function(seconds) {
  this.progress.totalWatchTime += seconds;
  this.progress.lastAccessedAt = new Date();
  await this.save();
  return this;
};

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
