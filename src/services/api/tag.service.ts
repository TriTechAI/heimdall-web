import apiClient, { handleApiError } from './client';

// 标签相关类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
  color?: string;
  description?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string;
}

export interface TagQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: 'name' | 'postCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface TagListResponse {
  list: Tag[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 标签服务类
class TagService {
  /**
   * 获取标签列表
   */
  async getList(params: TagQueryParams = {}): Promise<TagListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.keyword) queryParams.append('keyword', params.keyword);
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
   * 获取所有标签（不分页）
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
   * 根据ID获取标签
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
   * 创建新标签
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
   * 更新标签
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
   * 删除标签
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
   * 批量删除标签
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
   * 搜索标签
   */
  async search(keyword: string): Promise<Tag[]> {
    try {
      const response = await apiClient.get<Tag[]>(`/tags/search?q=${encodeURIComponent(keyword)}`);
      return response as unknown as Tag[];
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// 导出单例实例
export const tagService = new TagService();