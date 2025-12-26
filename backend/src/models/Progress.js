const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
  watchedDuration: {
    type: Number, // in seconds
    default: 0
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0
  },
  lastPosition: {
    type: Number, // timestamp in seconds where user left off
    default: 0
  },
  watchPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  watchHistory: [{
    startTime: Number,
    endTime: Number,
    watchedAt: { type: Date, default: Date.now }
  }],
  quizAttempts: [{
    attemptedAt: Date,
    score: Number,
    passed: Boolean
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, {
  timestamps: true
});

// Compound index for unique progress tracking
progressSchema.index({ user: 1, lesson: 1 }, { unique: true });
progressSchema.index({ user: 1, course: 1 });
progressSchema.index({ enrollment: 1 });

// Update watch progress
progressSchema.methods.updateProgress = async function(position, duration) {
  this.lastPosition = position;
  this.totalDuration = duration;
  
  // Calculate watched percentage based on watch history
  const watchedRanges = this.mergeWatchHistory();
  const totalWatched = watchedRanges.reduce((sum, range) => sum + (range.end - range.start), 0);
  
  this.watchedDuration = Math.min(totalWatched, duration);
  this.watchPercentage = duration > 0 ? Math.round((this.watchedDuration / duration) * 100) : 0;
  
  // Check if lesson should be marked as complete (80% watched)
  if (this.watchPercentage >= 80 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  await this.save();
  return this;
};

// Merge overlapping watch history segments
progressSchema.methods.mergeWatchHistory = function() {
  if (this.watchHistory.length === 0) return [];
  
  const segments = this.watchHistory
    .map(h => ({ start: h.startTime, end: h.endTime }))
    .sort((a, b) => a.start - b.start);
  
  const merged = [segments[0]];
  
  for (let i = 1; i < segments.length; i++) {
    const last = merged[merged.length - 1];
    const current = segments[i];
    
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  
  return merged;
};

// Add watch segment
progressSchema.methods.addWatchSegment = async function(startTime, endTime) {
  this.watchHistory.push({
    startTime,
    endTime,
    watchedAt: new Date()
  });
  
  await this.updateProgress(endTime, this.totalDuration);
  return this;
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
