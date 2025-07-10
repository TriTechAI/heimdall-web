import apiClient, { handleApiError, type PaginationResponse } from './client';
import type { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  PostQueryParams,
  PostListResponse 
} from '@/types/models/post';

// Post service class
class PostService {
  /**
   * Get list of posts with pagination and filtering
   */
  async getList(params: PostQueryParams = {}): Promise<PostListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      // Add filter params
      if (params.status) queryParams.append('status', params.status);
      if (params.visibility) queryParams.append('visibility', params.visibility);
      if (params.tagId) queryParams.append('tagId', params.tagId);
      if (params.authorId) queryParams.append('authorId', params.authorId);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      // Add sort params
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<PostListResponse>(
        `/posts?${queryParams.toString()}`
      );
      
      return response as unknown as PostListResponse;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get single post by ID
   */
  async getById(id: string): Promise<Post> {
    try {
      return await apiClient.get<Post>(`/posts/${id}`) as unknown as Post;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Create new post
   */
  async create(data: CreatePostInput): Promise<Post> {
    try {
      return await apiClient.post<Post>('/posts', data) as unknown as Post;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update existing post
   */
  async update(id: string, data: UpdatePostInput): Promise<Post> {
    try {
      return await apiClient.put<Post>(`/posts/${id}`, data) as unknown as Post;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete post
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch delete posts
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.delete('/posts/batch', { data: { ids } });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Publish post
   */
  async publish(id: string, publishedAt?: string): Promise<Post> {
    try {
      return await apiClient.post<Post>(`/posts/${id}/publish`, {
        publishedAt
      }) as unknown as Post;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Unpublish post
   */
  async unpublish(id: string): Promise<Post> {
    try {
      return await apiClient.post<Post>(`/posts/${id}/unpublish`) as unknown as Post;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch update post status
   */
  async batchUpdateStatus(ids: string[], status: 'draft' | 'published' | 'archived'): Promise<void> {
    try {
      await apiClient.patch('/posts/batch/status', { ids, status });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// Export singleton instance
export const postService = new PostService();