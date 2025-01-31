import axios from "axios";

export const baseURL =
  "https://sah-platform-api-egghayfcc4ddeuae.canadacentral-01.azurewebsites.net";
// Create an axios instance
const apiInstance = axios.create({
  baseURL: `${baseURL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token from localStorage in each request
apiInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Add Authorization header to the request
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiInstance;
