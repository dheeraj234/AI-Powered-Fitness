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



// api.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

const api = axios.create({
  baseURL: API_URL,
});

// api.interceptors.request.use((config) => {
//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('token');

//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (userId) {
//     config.headers['X-User-ID'] = userId;
//   }
//   return config;
// });


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token) config.headers["Authorization"] = `Bearer ${token}`;

    // ❌ prevent X-User-ID from being sent to /register
    if (userId && !config.url.includes("/users/register")) {
        config.headers["X-User-ID"] = userId;
    }

    return config;
});


// existing exports
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);

// ✅ NEW: call your UserService.register
export const registerUserProfile = (payload) =>
  api.post('/users/register', payload);
