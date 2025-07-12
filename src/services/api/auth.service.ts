import apiClient, { handleApiError } from './client';
import type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest,
  ChangePasswordRequest 
} from '@/types/models/user';

// Auth service class
class AuthService {
  /**
   * User login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', data);
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', (response as any).token);
        localStorage.setItem('refreshToken', (response as any).refreshToken);
        localStorage.setItem('user', JSON.stringify((response as any).user));
      }
      
      return response as unknown as LoginResponse;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Don't throw error for logout, just log it
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<LoginResponse>('/auth/refresh', {
        refreshToken
      });
      
      // Update tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', (response as any).token);
        localStorage.setItem('refreshToken', (response as any).refreshToken);
        localStorage.setItem('user', JSON.stringify((response as any).user));
      }
      
      return response as unknown as LoginResponse;
    } catch (error) {
      // If refresh fails, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile');
      return response as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get stored token from localStorage
   */
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

// Export singleton instance
export const authService = new AuthService();