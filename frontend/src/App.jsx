import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import InstructorDashboard from "./pages/InstructorDashboard";
import Layout from "./components/Layout";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["student", "admin", "instructor"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute roles={["instructor", "admin"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
