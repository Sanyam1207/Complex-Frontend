// api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Your backend URL
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear localStorage
      localStorage.removeItem('token');
      
      // Redirect to homepage or show login modal
      // You can use a custom event or context to trigger the login modal
      window.dispatchEvent(new Event('auth:required'));
    }
    
    return Promise.reject(error);
  }
);

export default api;