import { useEffect, useState } from "react";
import { getAllCourses } from "../services/course.service";
import CourseCard from "../components/CourseCard";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getAllCourses();
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch courses");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2>All Courses</h2>

      {courses.length === 0 && <p>No courses available</p>}

      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onClick={() => navigate(`/courses/${course._id}`)}
        />
      ))}
    </div>
  );
};

export default Courses;
