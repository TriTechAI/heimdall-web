import { z } from 'zod';

// 文章表单验证模式
export const postFormSchema = z.object({
  // 基础信息
  title: z.string()
    .min(1, '标题不能为空')
    .max(200, '标题不能超过200个字符'),
  
  slug: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^[a-z0-9-]+$/.test(val);
    }, 'URL别名只能包含小写字母、数字和连字符'),
  
  content: z.string()
    .min(1, '内容不能为空'),
  
  excerpt: z.string()
    .max(500, '摘要不能超过500个字符')
    .optional(),

  // 发布设置
  status: z.enum(['draft', 'published', 'archived'], {
    required_error: '请选择文章状态',
  }),
  
  visibility: z.enum(['public', 'private', 'password'], {
    required_error: '请选择可见性',
  }),
  
  password: z.string().optional(),
  
  publishedAt: z.string().optional(),
  
  // 标签
  tagIds: z.array(z.string()).optional(),
  
  // SEO 设置
  metaTitle: z.string()
    .max(60, 'Meta标题不能超过60个字符')
    .optional(),
    
  metaDescription: z.string()
    .max(160, 'Meta描述不能超过160个字符')
    .optional(),
    
  metaKeywords: z.string()
    .max(255, 'Meta关键词不能超过255个字符')
    .optional(),

  // 特色图片
  featuredImage: z.string().optional(),
}).refine((data) => {
  // 如果选择密码保护，则密码不能为空
  if (data.visibility === 'password') {
    return data.password && data.password.length > 0;
  }
  return true;
}, {
  message: '密码保护模式下必须设置密码',
  path: ['password'],
});

// 推断类型
export type PostFormData = z.infer<typeof postFormSchema>;

// 表单默认值
export const getDefaultPostFormValues = (): Partial<PostFormData> => ({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  status: 'draft',
  visibility: 'public',
  password: '',
  publishedAt: '',
  tagIds: [],
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  featuredImage: '',
});

// 生成URL别名的工具函数
export const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除首尾的连字符
};