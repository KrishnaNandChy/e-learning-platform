const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Review must belong to a course"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },

    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      required: [true, "Please provide a review comment"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },

    isHelpful: {
      helpfulCount: {
        type: Number,
        default: 0,
      },
      helpfulBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    instructorReply: {
      comment: String,
      repliedAt: Date,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one review per user per course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Update course rating after review is saved
reviewSchema.post("save", async function () {
  await this.constructor.updateCourseRating(this.course);
});

// Update course rating after review is deleted
reviewSchema.post("remove", async function () {
  await this.constructor.updateCourseRating(this.course);
});

// Static method to calculate average rating
reviewSchema.statics.updateCourseRating = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId, isApproved: true },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const Course = mongoose.model("Course");
  
  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      "rating.average": Math.round(stats[0].averageRating * 10) / 10,
      "rating.count": stats[0].count,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      "rating.average": 0,
      "rating.count": 0,
    });
  }
};

module.exports = mongoose.model("Review", reviewSchema);
