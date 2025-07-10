import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { tagService } from '@/services/api/tag.service';
import type { 
  Tag, 
  CreateTagInput, 
  UpdateTagInput, 
  TagQueryParams,
  TagListResponse 
} from '@/services/api/tag.service';

// Query keys for cache management
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (params: TagQueryParams) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  search: (keyword: string) => [...tagKeys.all, 'search', keyword] as const,
};

/**
 * Hook for fetching tags list with pagination and filtering
 */
export function useTagList(params: TagQueryParams = {}) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagService.getList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook for fetching all tags (no pagination)
 */
export function useAllTags() {
  return useQuery({
    queryKey: [...tagKeys.all, 'all'],
    queryFn: () => tagService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for fetching single tag by ID
 */
export function useTag(id: string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for searching tags
 */
export function useSearchTags(keyword: string) {
  return useQuery({
    queryKey: tagKeys.search(keyword),
    queryFn: () => tagService.search(keyword),
    enabled: keyword.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for creating new tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagService.create,
    onSuccess: (newTag: any) => {
      // Invalidate and refetch tag lists
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...tagKeys.all, 'all'] });
      
      // Add the new tag to cache
      queryClient.setQueryData(tagKeys.detail(newTag.id), newTag);
      
      message.success('标签创建成功');
    },
    onError: (error) => {
      console.error('Failed to create tag:', error);
    },
  });
}

/**
 * Hook for updating existing tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagInput }) =>
      tagService.update(id, data),
    onSuccess: (updatedTag: any) => {
      // Update the tag in cache
      queryClient.setQueryData(tagKeys.detail(updatedTag.id), updatedTag);
      
      // Invalidate tag lists to reflect changes
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...tagKeys.all, 'all'] });
      
      message.success('标签更新成功');
    },
    onError: (error) => {
      console.error('Failed to update tag:', error);
    },
  });
}

/**
 * Hook for deleting tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagService.delete,
    onSuccess: (_, deletedId: string) => {
      // Remove tag from cache
      queryClient.removeQueries({ queryKey: tagKeys.detail(deletedId) });
      
      // Invalidate tag lists
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...tagKeys.all, 'all'] });
      
      message.success('标签删除成功');
    },
    onError: (error) => {
      console.error('Failed to delete tag:', error);
    },
  });
}

/**
 * Hook for batch deleting tags
 */
export function useBatchDeleteTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagService.batchDelete,
    onSuccess: (_, deletedIds: string[]) => {
      // Remove tags from cache
      deletedIds.forEach((id: string) => {
        queryClient.removeQueries({ queryKey: tagKeys.detail(id) });
      });
      
      // Invalidate tag lists
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...tagKeys.all, 'all'] });
      
      message.success(`${deletedIds.length} 个标签删除成功`);
    },
    onError: (error) => {
      console.error('Failed to delete tags:', error);
    },
  });
}