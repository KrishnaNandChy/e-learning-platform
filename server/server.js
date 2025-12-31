const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Serve static files
app.use("/uploads", express.static("uploads"));

// API Routes
app.get("/", (req, res) => {
  res.json({
    message: "🎓 EduLearn API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      courses: "/api/courses",
      lessons: "/api/lessons",
      enrollments: "/api/enrollments",
      reviews: "/api/reviews",
      categories: "/api/categories",
      admin: "/api/admin",
    },
  });
});

// Import Routes
const authRoutes = require("./routes/auth.routes");
// const userRoutes = require("./routes/user.routes"); // TODO: Create user routes
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const reviewRoutes = require("./routes/review.routes");
const categoryRoutes = require("./routes/category.routes");
const adminRoutes = require("./routes/admin.routes");

// Use Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes); // TODO: Enable when user routes are created
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler Middleware (should be last)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🚀 EduLearn Server Running!        ║
  ║   📍 Port: ${PORT}                      ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}  ║
  ║   📊 Database: Connected              ║
  ╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("❌ UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

module.exports = app;
