const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("E-Learning API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const authRoutes = require("./routes/auth.routes");

app.use("/api/auth", authRoutes);

const testRoutes = require("./routes/test.routes");

app.use("/api/test", testRoutes);

const courseRoutes = require("./routes/course.routes");

app.use("/api/courses", courseRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

app.use("/api/lessons", require("./routes/lesson.routes"));
