const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    maxlength: [2000, 'Review cannot exceed 2000 characters']
  },
  pros: [{
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulVotes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean,
    votedAt: { type: Date, default: Date.now }
  }],
  instructorResponse: {
    content: String,
    respondedAt: Date
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: String,
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  completionPercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique review per user per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });
reviewSchema.index({ course: 1, rating: -1 });
reviewSchema.index({ course: 1, createdAt: -1 });
reviewSchema.index({ isApproved: 1 });

// Update course rating after review
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.course);
});

reviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.course);
});

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(courseId) {
  const Course = mongoose.model('Course');
  
  const stats = await this.aggregate([
    { $match: { course: courseId, isApproved: true } },
    {
      $group: {
        _id: '$course',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    const distribution = {
      five: stats[0].ratingDistribution.filter(r => r === 5).length,
      four: stats[0].ratingDistribution.filter(r => r === 4).length,
      three: stats[0].ratingDistribution.filter(r => r === 3).length,
      two: stats[0].ratingDistribution.filter(r => r === 2).length,
      one: stats[0].ratingDistribution.filter(r => r === 1).length
    };
    
    await Course.findByIdAndUpdate(courseId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { five: 0, four: 0, three: 0, two: 0, one: 0 }
    });
  }
};

// Mark as helpful
reviewSchema.methods.markHelpful = async function(userId, isHelpful) {
  const existingVote = this.helpfulVotes.find(v => v.user.toString() === userId.toString());
  
  if (existingVote) {
    if (existingVote.isHelpful !== isHelpful) {
      existingVote.isHelpful = isHelpful;
      this.helpfulCount += isHelpful ? 1 : -1;
    }
  } else {
    this.helpfulVotes.push({ user: userId, isHelpful });
    if (isHelpful) this.helpfulCount += 1;
  }
  
  await this.save();
  return this;
};

// Add instructor response
reviewSchema.methods.addResponse = async function(content) {
  this.instructorResponse = {
    content,
    respondedAt: new Date()
  };
  await this.save();
  return this;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
