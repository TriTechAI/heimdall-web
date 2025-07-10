// API 通用类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

export interface PaginationMeta {
  current: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}