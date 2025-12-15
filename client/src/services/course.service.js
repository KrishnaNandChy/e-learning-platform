import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

// Get all published courses
export const getAllCourses = () => {
  return axios.get(API_URL);
};

// Get single course by ID
export const getCourseById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};
