// import axios from "axios";
// const API = axios.create({
//     baseURL: "http://localhost:5000/api",
//     withCredentials: true,
// });
// API.interceptors.request.use((cfg) => {
//     const t = localStorage.getItem("accessToken");
//     if (t) {
//         cfg.headers.Authorization = `Bearer ${t}`;
//     }
//     return cfg;
// })
// export default API;



// src/api/axios.js
import axios from "axios";
import.meta.env.VITE_API_BASE_URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach access token before every request
API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Handle 401 errors -> try refresh token
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL }/auth/refresh`,
          { refreshToken }
        );

        // Save new token
        localStorage.setItem("accessToken", data.accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed, logging out");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default API;
