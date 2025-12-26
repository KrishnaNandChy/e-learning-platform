const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  subtitle: {
    type: String,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'all_levels'
  },
  language: {
    type: String,
    default: 'English'
  },
  thumbnail: {
    public_id: String,
    url: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1/courses/default-thumbnail.png'
    }
  },
  promoVideo: {
    public_id: String,
    url: String,
    duration: Number
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  discountValidUntil: Date,
  isFree: {
    type: Boolean,
    default: false
  },
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  curriculum: [{
    sectionTitle: {
      type: String,
      required: true
    },
    sectionDescription: String,
    order: Number,
    lessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }]
  }],
  totalLessons: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0
  },
  totalSections: {
    type: Number,
    default: 0
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingDistribution: {
    five: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    one: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'rejected', 'archived'],
    default: 'draft'
  },
  rejectionReason: String,
  publishedAt: Date,
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  isFeatured: {
    type: Boolean,
    default: false
  },
  welcomeMessage: String,
  congratulationsMessage: String,
  certificateEnabled: {
    type: Boolean,
    default: true
  },
  certificateCompletionThreshold: {
    type: Number,
    default: 80, // 80% completion required
    min: 0,
    max: 100
  },
  hasQuiz: {
    type: Boolean,
    default: false
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ isApproved: 1 });
courseSchema.index({ isFeatured: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for effective price
courseSchema.virtual('effectivePrice').get(function() {
  if (this.isFree) return 0;
  if (this.discountPrice && this.discountValidUntil && new Date(this.discountValidUntil) > new Date()) {
    return this.discountPrice;
  }
  return this.price;
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (!this.discountPrice || this.price === 0) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.totalDuration / 3600);
  const minutes = Math.floor((this.totalDuration % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Generate slug before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

// Update section count
courseSchema.pre('save', function(next) {
  if (this.curriculum) {
    this.totalSections = this.curriculum.length;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
