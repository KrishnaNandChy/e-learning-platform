const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  type: {
    type: String,
    enum: ['practice', 'quiz', 'section_test', 'final_exam', 'mock_test'],
    default: 'quiz'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passingMarks: {
    type: Number,
    default: 40 // 40% by default
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Test duration is required'],
    min: 1
  },
  isTimed: {
    type: Boolean,
    default: true
  },
  shuffleQuestions: {
    type: Boolean,
    default: true
  },
  shuffleOptions: {
    type: Boolean,
    default: true
  },
  showResults: {
    type: String,
    enum: ['immediately', 'after_submission', 'after_deadline', 'manual'],
    default: 'immediately'
  },
  showCorrectAnswers: {
    type: Boolean,
    default: true
  },
  negativeMarking: {
    enabled: {
      type: Boolean,
      default: true // MANDATORY as per requirements
    },
    percentage: {
      type: Number,
      default: 25, // 25% negative marking
      min: 0,
      max: 100
    }
  },
  attemptLimits: {
    maxAttempts: {
      type: Number,
      default: 3 // -1 for unlimited
    },
    cooldownPeriod: {
      type: Number, // in hours between attempts
      default: 0
    }
  },
  availability: {
    startDate: Date,
    endDate: Date,
    isAlwaysAvailable: {
      type: Boolean,
      default: true
    }
  },
  instructions: {
    type: String,
    maxlength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  highestScore: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  certificateRequired: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testSchema.index({ course: 1 });
testSchema.index({ instructor: 1 });
testSchema.index({ lesson: 1 });
testSchema.index({ type: 1 });
testSchema.index({ isPublished: 1 });

// Virtual for formatted duration
testSchema.virtual('formattedDuration').get(function() {
  if (this.duration < 60) {
    return `${this.duration} min`;
  }
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
});

// Check if test is available
testSchema.methods.isAvailable = function() {
  if (this.availability.isAlwaysAvailable) return true;
  
  const now = new Date();
  const start = this.availability.startDate;
  const end = this.availability.endDate;
  
  if (start && now < start) return false;
  if (end && now > end) return false;
  
  return true;
};

// Update statistics
testSchema.methods.updateStats = async function(score) {
  this.totalAttempts += 1;
  
  // Update average
  this.averageScore = ((this.averageScore * (this.totalAttempts - 1)) + score) / this.totalAttempts;
  
  // Update highest
  if (score > this.highestScore) {
    this.highestScore = score;
  }
  
  await this.save();
};

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
