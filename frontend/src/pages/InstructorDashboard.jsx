import { useEffect, useState } from "react";
import {
  getInstructorCourses,
  publishCourse,
} from "../services/course.service";
import { useAuth } from "../context/AuthContext";

const InstructorDashboard = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    const res = await getInstructorCourses(token);
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handlePublish = async (id) => {
    await publishCourse(id, token);
    fetchCourses();
  };

  return (
    <div>
      <h2>👨‍🏫 Instructor Dashboard</h2>

      {courses.length === 0 && <p>No courses created yet</p>}

      {courses.map((course) => (
        <div key={course._id} style={{ borderBottom: "1px solid #ccc" }}>
          <h3>{course.title}</h3>
          <p>Status: {course.isPublished ? "Published" : "Draft"}</p>

          {!course.isPublished && (
            <button onClick={() => handlePublish(course._id)}>Publish</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default InstructorDashboard;
