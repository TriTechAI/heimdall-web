'use client';

import { useRouter } from 'next/navigation';
import { Typography, Button, Space, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { PostPreview } from '@/components/features/post/PostPreview';
import { usePost } from '@/services/hooks/usePosts';

const { Title } = Typography;

interface PreviewPostPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPostPage({ params }: PreviewPostPageProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(params.id);

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
    <div className="min-h-screen bg-gray-50">
      {/* 头部操作栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            >
              返回
            </Button>
            <div>
              <Title level={3} className="mb-1">
                文章预览
              </Title>
              <p className="text-gray-600 text-sm m-0">
                预览文章在前台的显示效果
              </p>
            </div>
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/posts/${post.id}/edit`)}
            >
              编辑文章
            </Button>
          </Space>
        </div>
      </div>

      {/* 预览内容 */}
      <div className="px-6 py-8">
        <PostPreview post={post} />
      </div>
    </div>
  );
}