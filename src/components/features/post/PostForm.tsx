'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Card,
  Row,
  Col,
  Space,
  Button,
  Typography,
  Divider,
  message,
  Upload,
  Image,
} from 'antd';
import {
  SaveOutlined,
  SendOutlined,
  EyeOutlined,
  PictureOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { postFormSchema, type PostFormData, getDefaultPostFormValues, generateSlugFromTitle } from '@/lib/validators/post.validator';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { imageUploadService } from '@/services/api/upload.service';
import { TagSelector } from '@/components/features/tag/TagSelector';
import type { Post } from '@/types/models/post';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface PostFormProps {
  post?: Post;
  onSubmit: (data: PostFormData) => Promise<void>;
  onSaveDraft?: (data: PostFormData) => Promise<void>;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

export function PostForm({ 
  post, 
  onSubmit, 
  onSaveDraft, 
  loading = false, 
  mode = 'create' 
}: PostFormProps) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');

  // 初始化表单
  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: post ? {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      status: post.status,
      visibility: post.visibility,
      password: post.password || '',
      publishedAt: post.publishedAt || '',
      tagIds: post.tags?.map((tag: any) => tag.id) || [],
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords || '',
      featuredImage: post.featuredImage || '',
    } : getDefaultPostFormValues(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    control,
  } = form;

  // 监听表单字段变化
  const watchedTitle = watch('title');
  const watchedSlug = watch('slug');
  const watchedContent = watch('content');
  const watchedVisibility = watch('visibility');
  const watchedStatus = watch('status');

  // 自动生成slug
  useEffect(() => {
    if (mode === 'create' && watchedTitle && !watchedSlug) {
      const newSlug = generateSlugFromTitle(watchedTitle);
      setValue('slug', newSlug);
    }
  }, [watchedTitle, watchedSlug, mode, setValue]);

  // 自动保存草稿
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || !onSaveDraft) return;

    const timer = setTimeout(() => {
      const formData = {
        title: watchedTitle,
        slug: watchedSlug,
        content: watchedContent,
        status: 'draft',
      } as PostFormData;

      if (formData.title && formData.content) {
        onSaveDraft(formData).then(() => {
          message.success('草稿已自动保存', 1);
        }).catch(() => {
          message.error('自动保存失败', 1);
        });
      }
    }, 5000); // 5秒后自动保存

    return () => clearTimeout(timer);
  }, [watchedTitle, watchedContent, watchedSlug, isDirty, autoSaveEnabled, onSaveDraft]);

  // 处理表单提交
  const handleFormSubmit = async (data: PostFormData) => {
    try {
      await onSubmit(data);
      message.success(mode === 'create' ? '文章创建成功' : '文章更新成功');
    } catch (error) {
      message.error(mode === 'create' ? '文章创建失败' : '文章更新失败');
    }
  };

  // 处理发布
  const handlePublish = () => {
    setValue('status', 'published');
    if (!watch('publishedAt')) {
      setValue('publishedAt', dayjs().format('YYYY-MM-DDTHH:mm'));
    }
    handleSubmit(handleFormSubmit)();
  };

  // 处理保存草稿
  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(handleFormSubmit)();
  };

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    try {
      const url = await imageUploadService.uploadImage(file);
      setFeaturedImageUrl(url);
      setValue('featuredImage', url);
      message.success('图片上传成功');
    } catch (error: any) {
      message.error(error.message || '图片上传失败');
    }
    return false; // 阻止默认上传
  };

  // 移除特色图片
  const handleRemoveImage = () => {
    setFeaturedImageUrl('');
    setValue('featuredImage', '');
  };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Row gutter={24}>
          {/* 主要内容区域 */}
          <Col xs={24} lg={16}>
            <Card>
              {/* 文章标题 */}
              <div className="mb-6">
                <Input
                  {...register('title')}
                  placeholder="输入文章标题..."
                  size="large"
                  className="text-2xl font-semibold border-0 px-0"
                  style={{ 
                    fontSize: '24px', 
                    fontWeight: 600,
                    boxShadow: 'none',
                    borderBottom: '1px solid #d9d9d9'
                  }}
                />
                {errors.title && (
                  <Text type="danger" className="text-sm">
                    {errors.title.message}
                  </Text>
                )}
              </div>

              {/* URL别名 */}
              <div className="mb-4">
                <Text className="text-sm text-gray-500 block mb-2">URL别名（可选）</Text>
                <Input
                  {...register('slug')}
                  placeholder="url-slug"
                  prefix="/"
                  className="font-mono"
                />
                {errors.slug && (
                  <Text type="danger" className="text-sm">
                    {errors.slug.message}
                  </Text>
                )}
              </div>

              {/* 内容编辑器 */}
              <div className="mb-6">
                <Text className="text-sm text-gray-500 block mb-2">文章内容</Text>
                <MarkdownEditor
                  value={watchedContent}
                  onChange={(value) => setValue('content', value)}
                  height={400}
                  placeholder="开始编写您的文章内容..."
                  onImageUpload={async (file) => {
                    try {
                      return await imageUploadService.uploadImage(file);
                    } catch (error: any) {
                      message.error(error.message || '图片上传失败');
                      throw error;
                    }
                  }}
                />
                {errors.content && (
                  <Text type="danger" className="text-sm">
                    {errors.content.message}
                  </Text>
                )}
              </div>

              {/* 摘要 */}
              <div className="mb-4">
                <Text className="text-sm text-gray-500 block mb-2">文章摘要（可选）</Text>
                <TextArea
                  {...register('excerpt')}
                  placeholder="简短描述文章内容..."
                  rows={3}
                  showCount
                  maxLength={500}
                />
                {errors.excerpt && (
                  <Text type="danger" className="text-sm">
                    {errors.excerpt.message}
                  </Text>
                )}
              </div>
            </Card>
          </Col>

          {/* 侧边栏设置 */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" className="w-full" size="middle">
              {/* 发布操作 */}
              <Card title="发布设置" size="small">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text className="text-sm block mb-2">状态</Text>
                    <Select
                      {...register('status')}
                      value={watchedStatus}
                      onChange={(value) => setValue('status', value)}
                      className="w-full"
                    >
                      <Option value="draft">草稿</Option>
                      <Option value="published">已发布</Option>
                      <Option value="archived">已归档</Option>
                    </Select>
                  </div>

                  <div>
                    <Text className="text-sm block mb-2">可见性</Text>
                    <Select
                      {...register('visibility')}
                      value={watchedVisibility}
                      onChange={(value) => setValue('visibility', value)}
                      className="w-full"
                    >
                      <Option value="public">公开</Option>
                      <Option value="private">私密</Option>
                      <Option value="password">密码保护</Option>
                    </Select>
                  </div>

                  {watchedVisibility === 'password' && (
                    <div>
                      <Text className="text-sm block mb-2">访问密码</Text>
                      <Input
                        {...register('password')}
                        type="password"
                        placeholder="设置访问密码"
                      />
                      {errors.password && (
                        <Text type="danger" className="text-sm">
                          {errors.password.message}
                        </Text>
                      )}
                    </div>
                  )}

                  {watchedStatus === 'published' && (
                    <div>
                      <Text className="text-sm block mb-2">发布时间</Text>
                      <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        value={watch('publishedAt') ? dayjs(watch('publishedAt')) : null}
                        onChange={(date) => {
                          setValue('publishedAt', date ? date.format('YYYY-MM-DDTHH:mm') : '');
                        }}
                        className="w-full"
                      />
                    </div>
                  )}

                  <Divider className="my-3" />

                  <div className="flex items-center justify-between">
                    <Text className="text-sm">自动保存草稿</Text>
                    <Switch
                      size="small"
                      checked={autoSaveEnabled}
                      onChange={setAutoSaveEnabled}
                    />
                  </div>
                </Space>
              </Card>

              {/* 特色图片 */}
              <Card title="特色图片" size="small">
                {featuredImageUrl || watch('featuredImage') ? (
                  <div className="relative">
                    <Image
                      src={featuredImageUrl || watch('featuredImage')}
                      alt="特色图片"
                      className="w-full rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    />
                  </div>
                ) : (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageUpload}
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                      <PictureOutlined className="text-2xl text-gray-400 mb-2" />
                      <Text className="text-sm text-gray-500">点击上传特色图片</Text>
                    </div>
                  </Upload>
                )}
              </Card>

              {/* 标签选择 */}
              <Card title="标签" size="small">
                <TagSelector
                  value={watch('tagIds')}
                  onChange={(value) => setValue('tagIds', value)}
                  placeholder="选择或创建标签..."
                  allowCreate={true}
                />
              </Card>

              {/* SEO设置 */}
              <Card title="SEO 设置" size="small">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text className="text-sm block mb-2">Meta 标题</Text>
                    <Input
                      {...register('metaTitle')}
                      placeholder="SEO 优化标题"
                      showCount
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Text className="text-sm block mb-2">Meta 描述</Text>
                    <TextArea
                      {...register('metaDescription')}
                      placeholder="搜索引擎描述"
                      rows={3}
                      showCount
                      maxLength={160}
                    />
                  </div>
                  <div>
                    <Text className="text-sm block mb-2">关键词</Text>
                    <Input
                      {...register('metaKeywords')}
                      placeholder="关键词，用逗号分隔"
                    />
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Text className="text-sm text-gray-500">
                {isDirty ? '有未保存的更改' : '所有更改已保存'}
              </Text>
              {autoSaveEnabled && isDirty && (
                <Text className="text-sm text-blue-500">自动保存中...</Text>
              )}
            </div>

            <Space>
              <Button 
                icon={<EyeOutlined />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                预览
              </Button>
              
              <Button 
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={loading}
                disabled={!watchedTitle || !watchedContent}
              >
                保存草稿
              </Button>
              
              <Button 
                type="primary"
                icon={<SendOutlined />}
                onClick={handlePublish}
                loading={loading}
                disabled={!watchedTitle || !watchedContent}
              >
                {watchedStatus === 'published' ? '更新文章' : '发布文章'}
              </Button>
            </Space>
          </div>
        </div>
      </form>
    </div>
  );
}