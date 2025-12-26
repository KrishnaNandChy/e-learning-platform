const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'true_false', 'multiple_select', 'fill_blank', 'short_answer'],
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [2000, 'Question cannot exceed 2000 characters']
  },
  questionImage: {
    public_id: String,
    url: String
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    image: {
      public_id: String,
      url: String
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed // Can be index, array of indices, or text
  },
  explanation: {
    type: String,
    maxlength: [2000, 'Explanation cannot exceed 2000 characters']
  },
  marks: {
    type: Number,
    default: 1,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topic: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  hint: {
    type: String,
    maxlength: [500, 'Hint cannot exceed 500 characters']
  },
  timeLimit: {
    type: Number, // in seconds, 0 for no limit
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statistics: {
    timesAnswered: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    timesIncorrect: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 } // in seconds
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
questionSchema.index({ course: 1 });
questionSchema.index({ test: 1 });
questionSchema.index({ instructor: 1 });
questionSchema.index({ type: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ question: 'text' });

// Virtual for success rate
questionSchema.virtual('successRate').get(function() {
  if (this.statistics.timesAnswered === 0) return 0;
  return Math.round((this.statistics.timesCorrect / this.statistics.timesAnswered) * 100);
});

// Check answer
questionSchema.methods.checkAnswer = function(userAnswer) {
  switch (this.type) {
    case 'mcq':
    case 'true_false':
      return userAnswer === this.correctAnswer;
    
    case 'multiple_select':
      if (!Array.isArray(userAnswer) || !Array.isArray(this.correctAnswer)) return false;
      return userAnswer.length === this.correctAnswer.length &&
        userAnswer.every(ans => this.correctAnswer.includes(ans));
    
    case 'fill_blank':
    case 'short_answer':
      return userAnswer.toLowerCase().trim() === this.correctAnswer.toLowerCase().trim();
    
    default:
      return false;
  }
};

// Update statistics
questionSchema.methods.updateStats = async function(isCorrect, timeTaken) {
  this.statistics.timesAnswered += 1;
  
  if (isCorrect) {
    this.statistics.timesCorrect += 1;
  } else {
    this.statistics.timesIncorrect += 1;
  }
  
  // Update average time
  const totalTime = this.statistics.averageTime * (this.statistics.timesAnswered - 1) + timeTaken;
  this.statistics.averageTime = totalTime / this.statistics.timesAnswered;
  
  await this.save();
};

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
