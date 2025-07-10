import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { commentService } from '@/services/api/comment.service';
import type { 
  Comment, 
  CommentQueryParams,
  CommentListResponse,
  CommentStatus,
  BatchUpdateCommentsInput 
} from '@/services/api/comment.service';

// Query keys for cache management
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (params: CommentQueryParams) => [...commentKeys.lists(), params] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
  stats: () => [...commentKeys.all, 'stats'] as const,
};

/**
 * Hook for fetching comments list with pagination and filtering
 */
export function useCommentList(params: CommentQueryParams = {}) {
  return useQuery({
    queryKey: commentKeys.list(params),
    queryFn: () => commentService.getList(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching single comment by ID
 */
export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => commentService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching comment statistics
 */
export function useCommentStats() {
  return useQuery({
    queryKey: commentKeys.stats(),
    queryFn: () => commentService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for updating comment status
 */
export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) =>
      commentService.updateStatus(id, status),
    onSuccess: (updatedComment: Comment) => {
      // Update the comment in cache
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      
      // Invalidate comment lists and stats
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
      
      const statusText = {
        approved: '通过',
        rejected: '拒绝',
        spam: '标记为垃圾',
        pending: '待审核',
      }[updatedComment.status];
      
      message.success(`评论已${statusText}`);
    },
    onError: (error) => {
      console.error('Failed to update comment status:', error);
    },
  });
}

/**
 * Hook for batch updating comment status
 */
export function useBatchUpdateCommentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.batchUpdateStatus,
    onSuccess: (_, { ids, status }: BatchUpdateCommentsInput) => {
      // Invalidate comment lists and stats
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
      
      // Invalidate individual comment details
      ids.forEach((id: string) => {
        queryClient.invalidateQueries({ queryKey: commentKeys.detail(id) });
      });
      
      const statusText = {
        approved: '通过',
        rejected: '拒绝',
        spam: '标记为垃圾',
        pending: '待审核',
      }[status];
      
      message.success(`${ids.length} 条评论已${statusText}`);
    },
    onError: (error) => {
      console.error('Failed to batch update comment status:', error);
    },
  });
}

/**
 * Hook for deleting comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.delete,
    onSuccess: (_, deletedId: string) => {
      // Remove comment from cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(deletedId) });
      
      // Invalidate comment lists and stats
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
      
      message.success('评论删除成功');
    },
    onError: (error) => {
      console.error('Failed to delete comment:', error);
    },
  });
}

/**
 * Hook for batch deleting comments
 */
export function useBatchDeleteComments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.batchDelete,
    onSuccess: (_, deletedIds: string[]) => {
      // Remove comments from cache
      deletedIds.forEach((id: string) => {
        queryClient.removeQueries({ queryKey: commentKeys.detail(id) });
      });
      
      // Invalidate comment lists and stats
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: commentKeys.stats() });
      
      message.success(`${deletedIds.length} 条评论删除成功`);
    },
    onError: (error) => {
      console.error('Failed to delete comments:', error);
    },
  });
}

/**
 * Hook for replying to comment
 */
export function useReplyComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentService.reply(commentId, content),
    onSuccess: (newReply: Comment) => {
      // Invalidate comment lists to show the new reply
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      
      // Invalidate the parent comment to update reply count
      if (newReply.parent?.id) {
        queryClient.invalidateQueries({ queryKey: commentKeys.detail(newReply.parent.id) });
      }
      
      message.success('回复发送成功');
    },
    onError: (error) => {
      console.error('Failed to reply comment:', error);
    },
  });
}