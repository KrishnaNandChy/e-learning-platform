import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, enrollCourse } from "../services/course.service";
import { useAuth } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await getCourseById(id);
      setCourse(res.data);

      if (user && res.data.enrolledStudents.includes(user.id)) {
        setEnrolled(true);
      }
    };

    fetchCourse();
  }, [id, user]);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await enrollCourse(id, token);
      setEnrolled(true);
      alert("Enrolled successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      <p>Price: ₹{course.price}</p>

      {user?.role === "student" && (
        <button onClick={handleEnroll} disabled={enrolled || loading}>
          {enrolled ? "Already Enrolled" : "Enroll Now"}
        </button>
      )}
    </div>
  );
};

export default CourseDetail;
