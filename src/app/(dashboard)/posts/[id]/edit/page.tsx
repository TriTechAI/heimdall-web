'use client';

import { useRouter } from 'next/navigation';
import { Typography, Spin, Alert } from 'antd';
import { PostForm } from '@/components/features/post/PostForm';
import { usePost, useUpdatePost } from '@/services/hooks/usePosts';
import type { PostFormData } from '@/lib/validators/post.validator';

const { Title } = Typography;

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(params.id);
  const updatePostMutation = useUpdatePost();

  const handleSubmit = async (data: PostFormData) => {
    if (!post) return;

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: data,
      });

      // 如果是发布操作，跳转到文章列表
      if (data.status === 'published') {
        router.push('/posts');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  const handleSaveDraft = async (data: PostFormData) => {
    if (!post) return;

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: {
          ...data,
          status: 'draft',
        },
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Alert
          message="文章加载失败"
          description="无法找到指定的文章，可能已被删除或您没有访问权限。"
          type="error"
          showIcon
          action={
            <button
              onClick={() => router.push('/posts')}
              className="text-blue-600 hover:text-blue-800"
            >
              返回文章列表
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="mb-2">
            编辑文章
          </Title>
          <p className="text-gray-600 m-0">
            编辑 "{post.title}"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <PostForm
          mode="edit"
          post={post}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          loading={updatePostMutation.isPending}
        />
      </div>
    </div>
  );
}