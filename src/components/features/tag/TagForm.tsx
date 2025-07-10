'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Modal,
  Form,
  Input,
  Select,
  ColorPicker,
  Space,
  Typography,
} from 'antd';
import type { Tag, CreateTagInput, UpdateTagInput } from '@/services/api/tag.service';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

// 标签表单验证模式
const tagFormSchema = z.object({
  name: z.string()
    .min(1, '标签名称不能为空')
    .max(50, '标签名称不能超过50个字符'),
  
  slug: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[a-z0-9-]+$/.test(val);
    }, 'URL别名只能包含小写字母、数字和连字符'),
  
  color: z.string().optional(),
  
  description: z.string()
    .max(200, '描述不能超过200个字符')
    .optional(),
});

type TagFormData = z.infer<typeof tagFormSchema>;

interface TagFormProps {
  tag?: Tag;
  visible: boolean;
  onSubmit: (data: CreateTagInput | UpdateTagInput) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// 预设颜色
const presetColors = [
  '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1',
  '#13c2c2', '#eb2f96', '#faad14', '#a0d911', '#096dd9',
  '#389e0d', '#d46b08', '#cf1322', '#531dab', '#08979c',
];

// 生成slug的工具函数
const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export function TagForm({ tag, visible, onSubmit, onCancel, loading = false }: TagFormProps) {
  const isEdit = !!tag;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      color: '#1890ff',
      description: '',
    },
  });

  // 监听名称变化，自动生成slug
  const watchedName = watch('name');
  const watchedSlug = watch('slug');

  useEffect(() => {
    if (!isEdit && watchedName && !watchedSlug) {
      const newSlug = generateSlugFromName(watchedName);
      setValue('slug', newSlug);
    }
  }, [watchedName, watchedSlug, isEdit, setValue]);

  // 重置表单数据
  useEffect(() => {
    if (visible) {
      if (tag) {
        reset({
          name: tag.name,
          slug: tag.slug,
          color: tag.color || '#1890ff',
          description: tag.description || '',
        });
      } else {
        reset({
          name: '',
          slug: '',
          color: '#1890ff',
          description: '',
        });
      }
    }
  }, [visible, tag, reset]);

  const handleFormSubmit = async (data: TagFormData) => {
    try {
      if (isEdit && tag) {
        await onSubmit({
          id: tag.id,
          ...data,
        } as UpdateTagInput);
      } else {
        await onSubmit(data as CreateTagInput);
      }
      onCancel();
    } catch (error) {
      console.error('Tag form submit error:', error);
    }
  };

  return (
    <Modal
      title={isEdit ? '编辑标签' : '新建标签'}
      open={visible}
      onOk={handleSubmit(handleFormSubmit)}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
      width={500}
    >
      <Form layout="vertical">
        {/* 标签名称 */}
        <Form.Item
          label="标签名称"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
          required
        >
          <Input
            {...register('name')}
            placeholder="输入标签名称"
            showCount
            maxLength={50}
          />
        </Form.Item>

        {/* URL别名 */}
        <Form.Item
          label="URL别名"
          validateStatus={errors.slug ? 'error' : ''}
          help={errors.slug?.message || '用于URL中的标签标识，留空将自动生成'}
        >
          <Input
            {...register('slug')}
            placeholder="url-slug"
            prefix="/"
            className="font-mono"
          />
        </Form.Item>

        {/* 颜色选择 */}
        <Form.Item label="标签颜色">
          <Space direction="vertical" className="w-full">
            <ColorPicker
              value={watch('color')}
              onChange={(color) => setValue('color', color.toHexString())}
              presets={[
                {
                  label: '推荐颜色',
                  colors: presetColors,
                },
              ]}
              showText
            />
            <Text className="text-xs text-gray-500">
              选择标签的显示颜色，将影响标签在文章中的外观
            </Text>
          </Space>
        </Form.Item>

        {/* 描述 */}
        <Form.Item
          label="描述"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message || '可选，简短描述标签的用途'}
        >
          <TextArea
            {...register('description')}
            placeholder="标签描述..."
            rows={3}
            showCount
            maxLength={200}
          />
        </Form.Item>

        {/* 预览 */}
        <Form.Item label="预览效果">
          <div className="p-3 bg-gray-50 rounded border">
            <div
              className="inline-block px-2 py-1 text-xs rounded text-white"
              style={{ backgroundColor: watch('color') || '#1890ff' }}
            >
              {watch('name') || '标签名称'}
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}