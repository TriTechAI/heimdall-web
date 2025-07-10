import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginationResponse<T> {
  list: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/admin',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    // Return data directly from successful responses
    return (response.data.data || response.data) as T;
  },
  (error: AxiosError<ApiResponse>) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error('Access denied');
          break;
        case 404:
          message.error('Resource not found');
          break;
        case 422:
          // Validation errors
          message.error(data?.message || 'Validation failed');
          break;
        case 500:
          message.error('Server error, please try again later');
          break;
        default:
          message.error(data?.message || 'Request failed');
      }
    } else if (error.request) {
      // Network error
      message.error('Network error, please check your connection');
    } else {
      // Other errors
      message.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Utility function for handling errors in components
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error?.response?.data?.message) {
    message.error(error.response.data.message);
  } else if (error?.message) {
    message.error(error.message);
  } else {
    message.error('An unexpected error occurred');
  }
};