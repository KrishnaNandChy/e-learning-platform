const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide lesson title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Lesson must belong to a course"],
    },

    section: {
      type: String,
      required: [true, "Please provide section name"],
    },

    order: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["video", "article", "quiz", "assignment", "resource"],
      default: "video",
    },

    content: {
      videoUrl: String,
      articleContent: String,
      resources: [
        {
          title: String,
          url: String,
          type: String, // pdf, zip, etc
        },
      ],
    },

    duration: {
      type: Number,
      default: 0, // in minutes
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    completedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    quiz: {
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
        },
      ],
      passingScore: {
        type: Number,
        default: 70,
      },
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ course: 1, section: 1 });

module.exports = mongoose.model("Lesson", lessonSchema);
