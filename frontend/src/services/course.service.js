import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

export const getAllCourses = () => {
  return axios.get(API_URL);
};

export const getCourseById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// ✅ CORRECT ENROLL FUNCTION (NO JSON BODY)
export const enrollInCourse = (courseId, token) => {
  return axios.post(
    `${API_URL}/${courseId}/enroll`,
    {}, // ⬅️ EMPTY OBJECT IS REQUIRED
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const getInstructorCourses = (token) => {
  return axios.get("http://localhost:5000/api/courses/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const publishCourse = (courseId, token) => {
  return axios.put(
    `http://localhost:5000/api/courses/${courseId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const enrollCourse = (courseId, token) => {
  return axios.post(
    `http://localhost:5000/api/courses/${courseId}/enroll`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
