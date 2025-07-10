'use client';

import { Typography, Card, Tag, Avatar, Divider } from 'antd';
import { 
  EyeOutlined, 
  MessageOutlined, 
  CalendarOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Post } from '@/types/models/post';

const { Title, Paragraph, Text } = Typography;

interface PostPreviewProps {
  post: Post;
}

export function PostPreview({ post }: PostPreviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm">
        {/* 文章状态 */}
        <div className="mb-4">
          <Tag color={getStatusColor(post.status)} className="mb-0">
            {getStatusText(post.status)}
          </Tag>
          {post.visibility === 'private' && (
            <Tag color="red" className="ml-2">私密</Tag>
          )}
          {post.visibility === 'password' && (
            <Tag color="orange" className="ml-2">密码保护</Tag>
          )}
        </div>

        {/* 特色图片 */}
        {post.featuredImage && (
          <div className="mb-6">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* 文章标题 */}
        <Title level={1} className="mb-4">
          {post.title}
        </Title>

        {/* 文章信息 */}
        <div className="flex items-center space-x-6 mb-6 text-gray-500">
          <div className="flex items-center space-x-2">
            <Avatar 
              size="small" 
              icon={<UserOutlined />}
            />
            <Text className="text-sm">
              {post.author?.username || '未知作者'}
            </Text>
          </div>

          <div className="flex items-center space-x-1">
            <CalendarOutlined className="text-sm" />
            <Text className="text-sm">
              {post.publishedAt 
                ? dayjs(post.publishedAt).format('YYYY年MM月DD日') 
                : dayjs(post.createdAt).format('YYYY年MM月DD日')
              }
            </Text>
          </div>

          <div className="flex items-center space-x-1">
            <EyeOutlined className="text-sm" />
            <Text className="text-sm">{post.viewCount} 次阅读</Text>
          </div>

          <div className="flex items-center space-x-1">
            <MessageOutlined className="text-sm" />
            <Text className="text-sm">{post.commentCount} 条评论</Text>
          </div>
        </div>

        {/* 文章摘要 */}
        {post.excerpt && (
          <div className="mb-6">
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
              <Text className="text-gray-700 italic">
                {post.excerpt}
              </Text>
            </div>
          </div>
        )}

        <Divider />

        {/* 文章内容 */}
        <div className="prose prose-lg max-w-none mb-8">
          {/* 这里应该渲染 Markdown 内容，现在先显示纯文本 */}
          <div className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* 文章标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <Text className="text-gray-500 text-sm block mb-2">标签：</Text>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <Tag
                  key={tag.id}
                  color={tag.color}
                  className="cursor-pointer hover:opacity-80"
                >
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* SEO 信息（仅在编辑模式下显示） */}
        {(post.metaTitle || post.metaDescription || post.metaKeywords) && (
          <div className="bg-gray-50 p-4 rounded">
            <Text className="text-sm font-medium block mb-2">SEO 信息：</Text>
            {post.metaTitle && (
              <div className="mb-2">
                <Text className="text-xs text-gray-500">Meta 标题：</Text>
                <Text className="text-sm block">{post.metaTitle}</Text>
              </div>
            )}
            {post.metaDescription && (
              <div className="mb-2">
                <Text className="text-xs text-gray-500">Meta 描述：</Text>
                <Text className="text-sm block">{post.metaDescription}</Text>
              </div>
            )}
            {post.metaKeywords && (
              <div>
                <Text className="text-xs text-gray-500">关键词：</Text>
                <Text className="text-sm block">{post.metaKeywords}</Text>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}