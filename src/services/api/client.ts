import axios, { AxiosError, AxiosResponse } from 'axios';
import { message } from 'antd';

// API Response types
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  code: string;  // Note: error code is string type
  msg: string;   // Note: field name is 'msg' not 'message'
  details?: any;
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
    // Handle successful responses
    // Check if response has the expected structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data as T;
    }
    // Fallback for non-standard responses
    return response.data as T;
  },
  (error: AxiosError<ApiErrorResponse | ApiResponse>) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      // Extract error message from different response formats
      let errorMessage = 'Request failed';
      if (data) {
        // Handle error response format (code as string, msg field)
        if ('msg' in data && typeof data.msg === 'string') {
          errorMessage = data.msg;
        }
        // Handle standard response format (code as number, message field)
        else if ('message' in data && typeof data.message === 'string') {
          errorMessage = data.message;
        }
      }
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          break;
        case 403:
          message.error(errorMessage || 'Access denied');
          break;
        case 404:
          message.error(errorMessage || 'Resource not found');
          break;
        case 422:
          // Validation errors
          message.error(errorMessage || 'Validation failed');
          break;
        case 500:
          message.error(errorMessage || 'Server error, please try again later');
          break;
        default:
          message.error(errorMessage);
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
  
  if (error?.response?.data) {
    const data = error.response.data;
    // Handle error response format
    if (data.msg) {
      message.error(data.msg);
    } else if (data.message) {
      message.error(data.message);
    } else {
      message.error('An unexpected error occurred');
    }
  } else if (error?.message) {
    message.error(error.message);
  } else {
    message.error('An unexpected error occurred');
  }
};