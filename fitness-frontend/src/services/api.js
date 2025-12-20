// import axios from "axios";

// const API_URL = 'http://localhost:8080/api';

// const api = axios.create({
//     baseURL:API_URL
// });

// api.interceptors.request.use((config) => {
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('token');

//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }

//     if (userId) {
//         config.headers['X-User-ID'] = userId;
//     }
//     return config;
// }
// );


// export const getActivities = () => api.get('/activities');
// export const addActivity = (activity) => api.post('/activities', activity);
// export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);



import axios from "axios";

console.log("🔥 REACT_APP_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);
console.log("🔥 Final API_URL =", `${import.meta.env.VITE_API_BASE_URL}/api`);

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // avoid sending X-User-ID on first register
  if (userId && !config.url.includes("/users/register")) {
    config.headers["X-User-ID"] = userId;
  }

  return config;
});

// API calls
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
export const registerUserProfile = (payload) => api.post('/users/register', payload);

export default api;
