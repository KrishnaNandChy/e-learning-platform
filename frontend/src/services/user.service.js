import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const getMyCourses = (token) => {
  return axios.get(`${API_URL}/me/courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
