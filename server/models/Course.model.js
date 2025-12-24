const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    subtitle: {
      type: String,
      maxlength: [300, 'Subtitle cannot exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
    },
    previewVideo: {
      type: String,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Design',
        'Marketing',
        'Business',
        'Photography',
        'Music',
        'Health & Fitness',
        'Personal Development',
        'Other',
      ],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: String,
      default: '0h 0m',
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    requirements: [{
      type: String,
    }],
    whatYouWillLearn: [{
      type: String,
    }],
    targetAudience: [{
      type: String,
    }],
    tags: [{
      type: String,
    }],
    // Statistics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    // Sections/Curriculum
    sections: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      order: Number,
      lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      }],
    }],
    // Status - renamed isNew to isNewCourse to avoid Mongoose conflict
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewCourse: {
      type: Boolean,
      default: true,
    },
    publishedAt: Date,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

// Virtual for reviews
courseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Course', courseSchema);
