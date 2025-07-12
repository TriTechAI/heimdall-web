import apiClient, { handleApiError } from './client';
import type { 
  Comment, 
  CreateCommentInput, 
  UpdateCommentInput, 
  CommentQueryParams,
  CommentListResponse,
  CommentModerationRequest,
  CommentStats
} from '@/types/models/comment';

// Comment service class
class CommentService {
  /**
   * Get list of comments with pagination and filtering
   */
  async getList(params: CommentQueryParams = {}): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Add filter params
      if (params.postId) queryParams.append('postId', params.postId);
      if (params.status) queryParams.append('status', params.status);
      if (params.visibility) queryParams.append('visibility', params.visibility);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      // Add sort params
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<CommentListResponse>(
        `/comments?${queryParams.toString()}`
      );
      
      return response as unknown as CommentListResponse;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   */
  async getStats(): Promise<CommentStats> {
    try {
      return await apiClient.get<CommentStats>('/comments/stats') as unknown as CommentStats;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get single comment by ID
   */
  async getById(id: string): Promise<Comment> {
    try {
      return await apiClient.get<Comment>(`/comments/${id}`) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Create new comment
   */
  async create(data: CreateCommentInput): Promise<Comment> {
    try {
      return await apiClient.post<Comment>('/comments', data) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Reply to a comment
   */
  async reply(id: string, data: CreateCommentInput): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/comments/${id}/reply`, data) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update existing comment
   */
  async update(id: string, data: UpdateCommentInput): Promise<Comment> {
    try {
      return await apiClient.put<Comment>(`/comments/${id}`, data) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete comment
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/comments/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch delete comments
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.delete('/comments/batch', { data: { ids } });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Approve comment
   */
  async approve(id: string): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/comments/${id}/approve`) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Reject comment
   */
  async reject(id: string): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/comments/${id}/reject`) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Mark comment as spam
   */
  async markAsSpam(id: string): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/comments/${id}/spam`) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch moderate comments (approve/reject/spam)
   */
  async batchModerate(request: CommentModerationRequest): Promise<void> {
    try {
      await apiClient.post('/comments/batch/moderate', request);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch update comment status
   */
  async batchUpdateStatus(ids: string[], status: Comment['status']): Promise<void> {
    try {
      await apiClient.patch('/comments/batch/status', { ids, status });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// Export singleton instance
export const commentService = new CommentService();