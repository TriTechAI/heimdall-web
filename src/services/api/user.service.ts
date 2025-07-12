import apiClient, { handleApiError } from './client';
import type { 
  User, 
  CreateUserInput, 
  UpdateUserInput, 
  UserQueryParams,
  UserListResponse,
  ChangePasswordRequest
} from '@/types/models/user';

// User service class
class UserService {
  /**
   * Get list of users with pagination and filtering
   */
  async getList(params: UserQueryParams = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Add filter params
      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      
      // Add sort params
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<UserListResponse>(
        `/users?${queryParams.toString()}`
      );
      
      return response as unknown as UserListResponse;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get single user by ID
   */
  async getById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${id}`) as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(data: CreateUserInput): Promise<User> {
    try {
      return await apiClient.post<User>('/users', data) as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update existing user
   */
  async update(id: string, data: UpdateUserInput): Promise<User> {
    try {
      return await apiClient.put<User>(`/users/${id}`, data) as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch delete users
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.delete('/users/batch', { data: { ids } });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update user status
   */
  async updateStatus(id: string, status: User['status']): Promise<User> {
    try {
      return await apiClient.patch<User>(`/users/${id}/status`, { status }) as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch update user status
   */
  async batchUpdateStatus(ids: string[], status: User['status']): Promise<void> {
    try {
      await apiClient.patch('/users/batch/status', { ids, status });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Reset user password
   */
  async resetPassword(id: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post(`/users/${id}/reset-password`, { newPassword });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Unlock user account
   */
  async unlock(id: string): Promise<User> {
    try {
      return await apiClient.post<User>(`/users/${id}/unlock`) as unknown as User;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get user login logs
   */
  async getLoginLogs(id: string, params?: { page?: number; limit?: number }): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      return await apiClient.get(`/users/${id}/login-logs?${queryParams.toString()}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();