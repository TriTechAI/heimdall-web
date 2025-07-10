'use client';

import { useRouter } from 'next/navigation';
import { Typography } from 'antd';
import { PostForm } from '@/components/features/post/PostForm';
import { useCreatePost } from '@/services/hooks/usePosts';
import type { PostFormData } from '@/lib/validators/post.validator';

const { Title } = Typography;

export default function NewPostPage() {
  const router = useRouter();
  const createPostMutation = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    try {
      const newPost = await createPostMutation.mutateAsync({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        visibility: data.visibility,
        password: data.password,
        publishedAt: data.publishedAt,
        tagIds: data.tagIds,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        featuredImage: data.featuredImage,
      });

      // 根据状态决定跳转逻辑
      if (data.status === 'published') {
        router.push('/posts');
      } else {
        router.push(`/posts/${newPost.id}/edit`);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const handleSaveDraft = async (data: PostFormData) => {
    try {
      await createPostMutation.mutateAsync({
        ...data,
        status: 'draft',
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="mb-2">
            创建新文章
          </Title>
          <p className="text-gray-600 m-0">
            使用强大的编辑器创作您的内容
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <PostForm
          mode="create"
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          loading={createPostMutation.isPending}
        />
      </div>
    </div>
  );
}