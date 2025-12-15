import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById } from "../services/course.service";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data);
      } catch (error) {
        console.error("Failed to fetch course");
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      <p>Price: ₹{course.price}</p>
    </div>
  );
};

export default CourseDetail;
