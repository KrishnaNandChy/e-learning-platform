import { useEffect, useState } from "react";
import { getMyCourses } from "../services/user.service";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses(token);
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to load enrolled courses");
      }
    };

    if (user?.role === "student") {
      fetchCourses();
    }
  }, [token, user]);

  return (
    <div>
      <h2>🎓 Student Dashboard</h2>
      <h4>Your enrolled courses</h4>

      {courses.length === 0 && <p>No enrolled courses yet</p>}

      {courses.map((course) => (
        <div key={course._id}>
          <h3>{course.title}</h3>
          <p>{course.category}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
