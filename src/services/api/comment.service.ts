import apiClient, { handleApiError } from './client';

// 评论状态枚举
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

// 评论接口
export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
    website?: string;
    avatar?: string;
    ip?: string;
  };
  post: {
    id: string;
    title: string;
    slug: string;
  };
  parent?: {
    id: string;
    author: string;
    content: string;
  };
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  replyCount: number;
}

// 评论查询参数
export interface CommentQueryParams {
  page?: number;
  limit?: number;
  status?: CommentStatus;
  postId?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// 评论列表响应
export interface CommentListResponse {
  list: Comment[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    spam: number;
  };
}

// 批量操作输入
export interface BatchUpdateCommentsInput {
  ids: string[];
  status: CommentStatus;
}

// 评论服务类
class CommentService {
  /**
   * 获取评论列表
   */
  async getList(params: CommentQueryParams = {}): Promise<CommentListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.postId) queryParams.append('postId', params.postId);
      if (params.keyword) queryParams.append('keyword', params.keyword);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
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
   * 获取单个评论
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
   * 更新评论状态
   */
  async updateStatus(id: string, status: CommentStatus): Promise<Comment> {
    try {
      return await apiClient.patch<Comment>(`/comments/${id}/status`, {
        status,
      }) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * 批量更新评论状态
   */
  async batchUpdateStatus(data: BatchUpdateCommentsInput): Promise<void> {
    try {
      await apiClient.patch('/comments/batch/status', data);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * 删除评论
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
   * 批量删除评论
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
   * 获取评论统计
   */
  async getStats(): Promise<CommentListResponse['stats']> {
    try {
      return await apiClient.get('/comments/stats') as unknown as CommentListResponse['stats'];
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  /**
   * 回复评论
   */
  async reply(commentId: string, content: string): Promise<Comment> {
    try {
      return await apiClient.post<Comment>(`/comments/${commentId}/reply`, {
        content,
      }) as unknown as Comment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

// 导出单例实例
export const commentService = new CommentService();