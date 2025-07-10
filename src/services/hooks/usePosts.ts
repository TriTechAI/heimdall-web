import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { postService } from '@/services/api/post.service';
import type { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  PostQueryParams,
  PostListResponse 
} from '@/types/models/post';

// Query keys for cache management
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params: PostQueryParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

/**
 * Hook for fetching posts list with pagination and filtering
 */
export function usePostList(params: PostQueryParams = {}) {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => postService.getList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
}

/**
 * Hook for fetching single post by ID
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for creating new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: (newPost: any) => {
      // Invalidate and refetch post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      // Add the new post to cache
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost);
      
      message.success('Post created successfully');
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
}

/**
 * Hook for updating existing post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) =>
      postService.update(id, data),
    onSuccess: (updatedPost: any) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);
      
      // Invalidate post lists to reflect changes
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      message.success('Post updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
  });
}

/**
 * Hook for deleting post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.delete,
    onSuccess: (_, deletedId: string) => {
      // Remove post from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(deletedId) });
      
      // Invalidate post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      message.success('Post deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
}

/**
 * Hook for batch deleting posts
 */
export function useBatchDeletePosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.batchDelete,
    onSuccess: (_, deletedIds: string[]) => {
      // Remove posts from cache
      deletedIds.forEach((id: string) => {
        queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      });
      
      // Invalidate post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      message.success(`${deletedIds.length} posts deleted successfully`);
    },
    onError: (error) => {
      console.error('Failed to delete posts:', error);
    },
  });
}

/**
 * Hook for publishing post
 */
export function usePublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, publishedAt }: { id: string; publishedAt?: string }) =>
      postService.publish(id, publishedAt),
    onSuccess: (updatedPost: any) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);
      
      // Invalidate post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      message.success('Post published successfully');
    },
    onError: (error) => {
      console.error('Failed to publish post:', error);
    },
  });
}

/**
 * Hook for unpublishing post
 */
export function useUnpublishPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.unpublish,
    onSuccess: (updatedPost: any) => {
      // Update the post in cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);
      
      // Invalidate post lists
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      message.success('Post unpublished successfully');
    },
    onError: (error) => {
      console.error('Failed to unpublish post:', error);
    },
  });
}

/**
 * Hook for batch updating post status
 */
export function useBatchUpdatePostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: 'draft' | 'published' | 'archived' }) =>
      postService.batchUpdateStatus(ids, status),
    onSuccess: (_, { ids, status }) => {
      // Invalidate post lists to reflect changes
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      
      // Invalidate individual post details that were updated
      ids.forEach(id => {
        queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      });
      
      message.success(`${ids.length} posts updated to ${status} successfully`);
    },
    onError: (error) => {
      console.error('Failed to update post status:', error);
    },
  });
}