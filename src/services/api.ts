import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';

// API instance connected to backend
const api: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // Enable cookies for authentication
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const authState = localStorage.getItem('auth-storage');
    if (authState) {
      try {
        const { state } = JSON.parse(authState);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth state:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

