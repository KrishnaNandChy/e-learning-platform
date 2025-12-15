const CourseCard = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "10px",
        cursor: "pointer",
      }}
    >
      <h3>{course.title}</h3>
      <p>{course.category}</p>
      <p>₹ {course.price}</p>
    </div>
  );
};

export default CourseCard;
