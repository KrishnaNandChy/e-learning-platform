const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  attemptNumber: {
    type: Number,
    default: 1
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  timeTaken: {
    type: Number, // in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['in_progress', 'submitted', 'timed_out', 'abandoned'],
    default: 'in_progress'
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    selectedAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    marksObtained: Number,
    timeTaken: Number // in seconds
  }],
  score: {
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unansweredCount: { type: Number, default: 0 },
    negativeMarks: { type: Number, default: 0 }
  },
  passed: {
    type: Boolean,
    default: false
  },
  rank: {
    type: Number
  },
  percentile: {
    type: Number
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  strengthAreas: [{
    topic: String,
    score: Number
  }],
  weakAreas: [{
    topic: String,
    score: Number
  }],
  isReviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
testResultSchema.index({ user: 1, test: 1 });
testResultSchema.index({ user: 1, course: 1 });
testResultSchema.index({ test: 1 });
testResultSchema.index({ score: -1 });
testResultSchema.index({ submittedAt: -1 });

// Calculate score with negative marking
testResultSchema.methods.calculateScore = async function(negativeMarkingPercentage = 25) {
  const Question = mongoose.model('Question');
  
  let totalMarks = 0;
  let obtainedMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let negativeMarks = 0;
  
  for (const answer of this.answers) {
    const question = await Question.findById(answer.question);
    if (!question) continue;
    
    const marks = question.marks || 1;
    totalMarks += marks;
    
    if (answer.selectedAnswer === null || answer.selectedAnswer === undefined) {
      unansweredCount++;
      answer.marksObtained = 0;
    } else if (question.checkAnswer(answer.selectedAnswer)) {
      correctCount++;
      obtainedMarks += marks;
      answer.isCorrect = true;
      answer.marksObtained = marks;
    } else {
      incorrectCount++;
      const negativeMark = (marks * negativeMarkingPercentage) / 100;
      negativeMarks += negativeMark;
      obtainedMarks -= negativeMark;
      answer.isCorrect = false;
      answer.marksObtained = -negativeMark;
    }
  }
  
  // Ensure obtained marks don't go below 0
  obtainedMarks = Math.max(0, obtainedMarks);
  
  this.score = {
    totalMarks,
    obtainedMarks: Math.round(obtainedMarks * 100) / 100,
    percentage: totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0,
    correctCount,
    incorrectCount,
    unansweredCount,
    negativeMarks: Math.round(negativeMarks * 100) / 100
  };
  
  await this.save();
  return this.score;
};

// Check if passed
testResultSchema.methods.checkPassed = async function(passingPercentage = 40) {
  this.passed = this.score.percentage >= passingPercentage;
  await this.save();
  return this.passed;
};

// Calculate rank among all attempts
testResultSchema.methods.calculateRank = async function() {
  const TestResult = mongoose.model('TestResult');
  
  const betterResults = await TestResult.countDocuments({
    test: this.test,
    status: 'submitted',
    'score.obtainedMarks': { $gt: this.score.obtainedMarks }
  });
  
  this.rank = betterResults + 1;
  
  // Calculate percentile
  const totalResults = await TestResult.countDocuments({
    test: this.test,
    status: 'submitted'
  });
  
  this.percentile = totalResults > 0 
    ? Math.round(((totalResults - this.rank) / totalResults) * 100) 
    : 100;
  
  await this.save();
  return { rank: this.rank, percentile: this.percentile };
};

// Analyze performance
testResultSchema.methods.analyzePerformance = async function() {
  const Question = mongoose.model('Question');
  
  const topicPerformance = {};
  
  for (const answer of this.answers) {
    const question = await Question.findById(answer.question);
    if (!question || !question.topic) continue;
    
    if (!topicPerformance[question.topic]) {
      topicPerformance[question.topic] = { correct: 0, total: 0 };
    }
    
    topicPerformance[question.topic].total++;
    if (answer.isCorrect) {
      topicPerformance[question.topic].correct++;
    }
  }
  
  const topics = Object.entries(topicPerformance).map(([topic, data]) => ({
    topic,
    score: Math.round((data.correct / data.total) * 100)
  }));
  
  topics.sort((a, b) => b.score - a.score);
  
  this.strengthAreas = topics.filter(t => t.score >= 70).slice(0, 5);
  this.weakAreas = topics.filter(t => t.score < 50).slice(0, 5);
  
  await this.save();
  return { strengthAreas: this.strengthAreas, weakAreas: this.weakAreas };
};

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;
