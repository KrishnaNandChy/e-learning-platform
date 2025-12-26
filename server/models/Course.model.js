const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide course title"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: [300, "Subtitle cannot exceed 300 characters"],
    },

    description: {
      type: String,
      required: [true, "Please provide course description"],
      minlength: [20, "Description must be at least 20 characters"],
    },

    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course must have an instructor"],
    },

    price: {
      type: Number,
      required: [true, "Please provide course price"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },

    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },

    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },

    category: {
      type: String,
      required: [true, "Please provide course category"],
      enum: {
        values: [
          "Development",
          "Business",
          "Design",
          "Marketing",
          "IT & Software",
          "Data Science",
          "Personal Development",
          "Photography",
          "Music",
          "Health & Fitness",
        ],
        message: "{VALUE} is not a valid category",
      },
    },

    level: {
      type: String,
      enum: {
        values: ["Beginner", "Intermediate", "Advanced", "All Levels"],
        message: "{VALUE} is not a valid level",
      },
      default: "Beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    duration: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },

    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    targetAudience: [
      {
        type: String,
        trim: true,
      },
    ],

    curriculum: [
      {
        sectionTitle: {
          type: String,
          required: true,
        },
        lessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
          },
        ],
      },
    ],

    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    stats: {
      totalStudents: {
        type: Number,
        default: 0,
      },
      totalLessons: {
        type: Number,
        default: 0,
      },
      totalDuration: {
        type: Number,
        default: 0, // in minutes
      },
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    tags: [String],

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

// Calculate actual price after discount
courseSchema.virtual("actualPrice").get(function () {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - (this.originalPrice * this.discount) / 100;
  }
  return this.price;
});

// Update stats before saving
courseSchema.pre("save", function (next) {
  if (this.enrolledStudents) {
    this.stats.totalStudents = this.enrolledStudents.length;
  }
  next();
});

// Indexes for better query performance
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ "rating.average": -1 });
courseSchema.index({ price: 1 });

module.exports = mongoose.model("Course", courseSchema);
