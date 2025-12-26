const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedLessons: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    currentLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },

    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    certificateId: String,

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    lastAccessed: {
      type: Date,
      default: Date.now,
    },

    timeSpent: {
      type: Number,
      default: 0, // in minutes
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique student-course combination
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Calculate progress before saving
enrollmentSchema.pre("save", async function (next) {
  if (this.isModified("completedLessons")) {
    const Course = mongoose.model("Course");
    const course = await Course.findById(this.course);
    
    if (course && course.stats.totalLessons > 0) {
      this.progress = Math.round(
        (this.completedLessons.length / course.stats.totalLessons) * 100
      );
      
      if (this.progress === 100 && !this.isCompleted) {
        this.isCompleted = true;
        this.completedAt = new Date();
        this.status = "completed";
      }
    }
  }
  next();
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
