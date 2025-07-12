// User role enum
export type UserRole = 'owner' | 'admin' | 'editor' | 'author';

// User status enum
export type UserStatus = 'active' | 'inactive' | 'locked';

// Base user interface
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  
  // Profile information
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  
  // Social media
  twitter?: string;
  facebook?: string;
  
  // Account status
  status: UserStatus;
  loginFailCount: number;
  lockedUntil?: string;
  
  // Login information
  lastLoginAt?: string;
  lastLoginIp?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// User creation input
export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  status?: UserStatus;
  
  // Profile information
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  
  // Social media
  twitter?: string;
  facebook?: string;
}

// User update input
export interface UpdateUserInput {
  email?: string;
  displayName?: string;
  role?: UserRole;
  status?: UserStatus;
  
  // Profile information
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  
  // Social media
  twitter?: string;
  facebook?: string;
}

// Password change request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User query parameters
export interface UserQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  keyword?: string;
  sortBy?: 'username' | 'email' | 'createdAt' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

// User list response
export interface UserListResponse {
  list: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Login request
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// Login response
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string;
}