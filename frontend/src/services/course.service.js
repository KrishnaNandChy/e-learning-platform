import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllCourses = async (params = {}) => {
  return api.get('/courses', { params });
};

export const getCourseById = async (id) => {
  return api.get(`/courses/${id}`);
};

export const getCoursesByCategory = async (category) => {
  return api.get(`/courses/category/${category}`);
};

export const searchCourses = async (query) => {
  return api.get('/courses/search', { params: { q: query } });
};

export const getEnrolledCourses = async () => {
  return api.get('/courses/enrolled');
};

export const enrollInCourse = async (courseId) => {
  return api.post(`/courses/${courseId}/enroll`);
};

export const getCourseProgress = async (courseId) => {
  return api.get(`/courses/${courseId}/progress`);
};

export const updateLessonProgress = async (courseId, lessonId, data) => {
  return api.put(`/courses/${courseId}/lessons/${lessonId}/progress`, data);
};

export const getCourseReviews = async (courseId) => {
  return api.get(`/courses/${courseId}/reviews`);
};

export const addCourseReview = async (courseId, review) => {
  return api.post(`/courses/${courseId}/reviews`, review);
};

export const getFeaturedCourses = async () => {
  return api.get('/courses/featured');
};

export const getPopularCourses = async () => {
  return api.get('/courses/popular');
};

export const getCategories = async () => {
  return api.get('/categories');
};

export default api;
