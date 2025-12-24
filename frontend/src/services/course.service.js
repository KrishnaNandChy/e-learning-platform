import api from './api';

export const getAllCourses = async (params = {}) => {
  return api.get('/courses', { params });
};

export const getCourseById = async (id) => {
  return api.get(`/courses/${id}`);
};

export const getFeaturedCourses = async () => {
  return api.get('/courses/featured');
};

export const getEnrolledCourses = async () => {
  return api.get('/courses/user/enrolled');
};

export const enrollInCourse = async (courseId) => {
  return api.post(`/courses/${courseId}/enroll`);
};

export const getCourseProgress = async (courseId) => {
  return api.get(`/courses/${courseId}/progress`);
};

export const updateLessonProgress = async (courseId, lessonId) => {
  return api.put(`/courses/${courseId}/progress`, { lessonId });
};

export const getCourseReviews = async (courseId, params = {}) => {
  return api.get(`/courses/${courseId}/reviews`, { params });
};

export const addCourseReview = async (courseId, review) => {
  return api.post(`/courses/${courseId}/reviews`, review);
};

export const toggleWishlist = async (courseId) => {
  return api.post(`/courses/${courseId}/wishlist`);
};

// Instructor endpoints
export const getInstructorCourses = async () => {
  return api.get('/courses/instructor/my-courses');
};

export const createCourse = async (data) => {
  return api.post('/courses', data);
};

export const updateCourse = async (id, data) => {
  return api.put(`/courses/${id}`, data);
};

export const deleteCourse = async (id) => {
  return api.delete(`/courses/${id}`);
};

export const publishCourse = async (id) => {
  return api.put(`/courses/${id}/publish`);
};

export default api;
