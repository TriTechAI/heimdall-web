// API 通用类型定义
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

export interface PaginationMeta {
  page: number;      // Changed from 'current' to 'page'
  limit: number;     // Changed from 'pageSize' to 'limit'
  total: number;
  hasNext: boolean;  // Added for backend compatibility
  hasPrev: boolean;  // Added for backend compatibility
}

export interface PaginatedResponse<T> {
  list: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  message: string;
  code?: number | string;
  details?: any;
}