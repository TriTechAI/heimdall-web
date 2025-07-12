import apiClient, { handleApiError } from './client';
import type { 
  Tag, 
  CreateTagInput, 
  UpdateTagInput, 
  TagQueryParams,
  TagListResponse 
} from '@/types/models/tag';

// Tag service class
class TagService {
  /**
   * Get list of tags with pagination and filtering
   */
  async getList(params: TagQueryParams = {}): Promise<TagListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      // Add filter params
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.visibility) queryParams.append('visibility', params.visibility);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get<TagListResponse>(
        `/tags?${queryParams.toString()}`
      );
      
      return response as unknown as unknown as TagListResponse;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get all tags without pagination
   */
  async getAll(): Promise<Tag[]> {
    try {
      return await apiClient.get<Tag[]>('/tags/all') as unknown as Tag[];
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Get single tag by ID
   */
  async getById(id: string): Promise<Tag> {
    try {
      return await apiClient.get<Tag>(`/tags/${id}`) as unknown as Tag;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Create new tag
   */
  async create(data: CreateTagInput): Promise<Tag> {
    try {
      return await apiClient.post<Tag>('/tags', data) as unknown as Tag;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Update existing tag
   */
  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    try {
      return await apiClient.put<Tag>(`/tags/${id}`, data) as unknown as Tag;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete tag
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/tags/${id}`);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Batch delete tags
   */
  async batchDelete(ids: string[]): Promise<void> {
    try {
      await apiClient.delete('/tags/batch', { data: { ids } });
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * Search tags
   */
  async search(keyword: string): Promise<Tag[]> {
    try {
      return await apiClient.get<Tag[]>(`/tags/search?keyword=${encodeURIComponent(keyword)}`) as unknown as Tag[];
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// Export singleton instance
export const tagService = new TagService();