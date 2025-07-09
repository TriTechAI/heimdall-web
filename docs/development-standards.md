# Heimdall Web 前端开发规范与最佳实践

> 本文档定义了 Heimdall Web 项目的开发规范、代码标准和最佳实践。所有开发人员必须遵循这些规范。

## 📋 目录

1. [项目初始化](#1-项目初始化)
2. [编码规范](#2-编码规范)
3. [项目结构规范](#3-项目结构规范)
4. [组件开发规范](#4-组件开发规范)
5. [Markdown 编辑器规范](#5-markdown-编辑器规范)
6. [状态管理规范](#6-状态管理规范)
7. [API 集成规范](#7-api-集成规范)
8. [样式开发规范](#8-样式开发规范)
9. [性能优化规范](#9-性能优化规范)
10. [测试规范](#10-测试规范)
11. [Git 工作流程](#11-git-工作流程)
12. [文档规范](#12-文档规范)

---

## 1. 项目初始化

### 1.1 技术栈版本锁定
```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.3.x",
    "react-dom": "18.3.x",
    "antd": "5.20.x",
    "@ant-design/icons": "5.4.x",
    "@tanstack/react-query": "5.51.x",
    "axios": "1.7.x",
    "dayjs": "1.11.x",
    "zod": "3.23.x",
    "@uiw/react-md-editor": "4.0.x",
    "react-markdown": "9.0.x",
    "remark-gfm": "4.0.x",
    "rehype-highlight": "7.0.x",
    "katex": "0.16.x",
    "rehype-katex": "7.0.x"
  },
  "devDependencies": {
    "typescript": "5.5.x",
    "eslint": "8.57.x",
    "prettier": "3.3.x",
    "@types/react": "18.3.x",
    "@types/node": "20.14.x"
  }
}
```

### 1.2 项目配置文件

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error"
  }
}
```

#### .prettierrc
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 2. 编码规范

### 2.1 命名规范

#### 文件命名
```
# 组件文件 - PascalCase
PostEditor.tsx
UserTable.tsx

# 工具文件 - camelCase
apiClient.ts
dateUtils.ts

# 类型文件 - camelCase
postTypes.ts
userTypes.ts

# 常量文件 - camelCase
apiConstants.ts
```

#### 变量和函数命名
```typescript
// 常量 - UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// 变量 - camelCase
const userProfile = { name: 'John' };
const isLoading = false;

// 函数 - camelCase
function calculateReadingTime(content: string): number {
  // ...
}

// React 组件 - PascalCase
function PostEditor({ post }: PostEditorProps) {
  // ...
}

// 自定义 Hook - use 前缀
function usePostData(postId: string) {
  // ...
}

// 类型/接口 - PascalCase
interface UserProfile {
  id: string;
  name: string;
}

type PostStatus = 'draft' | 'published';
```

### 2.2 TypeScript 规范

#### 类型定义原则
```typescript
// ✅ 好的实践 - 使用明确的类型
interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// ❌ 避免使用 any
const data: any = fetchData(); // 错误

// ✅ 使用 unknown 或具体类型
const data: unknown = fetchData(); // 正确
```

#### 类型导出规范
```typescript
// types/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
}

export interface CreatePostInput {
  title: string;
  content: string;
  tagIds: string[];
}

export type PostStatus = 'draft' | 'published' | 'archived';
```

### 2.3 React 组件规范

#### 函数组件模板
```typescript
// components/PostCard.tsx
import { FC, memo } from 'react';
import { Card, Tag } from 'antd';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onClick?: (id: string) => void;
}

export const PostCard: FC<PostCardProps> = memo(({ post, onClick }) => {
  const handleClick = () => {
    onClick?.(post.id);
  };

  return (
    <Card 
      title={post.title} 
      onClick={handleClick}
      hoverable
    >
      <p>{post.excerpt}</p>
      <div>
        {post.tags.map((tag) => (
          <Tag key={tag.id} color={tag.color}>
            {tag.name}
          </Tag>
        ))}
      </div>
    </Card>
  );
});

PostCard.displayName = 'PostCard';
```

---

## 3. 项目结构规范

### 3.1 目录结构
```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证路由组
│   │   └── login/
│   ├── (admin)/             # 管理后台路由组
│   │   ├── layout.tsx       # 统一布局
│   │   ├── posts/           # 文章管理
│   │   │   ├── page.tsx     # 文章列表
│   │   │   ├── new/page.tsx # 新建文章
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx # 编辑文章
│   │   ├── tags/            # 标签管理
│   │   ├── comments/        # 评论管理
│   │   └── users/           # 用户管理
│   └── api/                 # API 路由
├── components/              # 组件目录
│   ├── common/              # 通用组件
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   ├── layout/              # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── AdminLayout.tsx
│   ├── editor/              # 编辑器组件
│   │   ├── MarkdownEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   └── PreviewPane.tsx
│   └── post/                # 文章相关组件
│       ├── PostTable.tsx
│       ├── PostForm.tsx
│       └── PostCard.tsx
├── hooks/                   # 自定义 Hooks
│   ├── useAuth.ts
│   ├── usePosts.ts
│   └── useDebounce.ts
├── lib/                     # 工具库
│   ├── api/                 # API 相关
│   │   ├── client.ts        # API 客户端
│   │   └── endpoints.ts     # API 端点
│   ├── utils/               # 工具函数
│   │   ├── date.ts
│   │   ├── markdown.ts
│   │   └── validation.ts
│   └── constants/           # 常量定义
│       ├── api.ts
│       └── routes.ts
├── types/                   # TypeScript 类型
│   ├── api.ts               # API 相关类型
│   ├── post.ts              # 文章类型
│   ├── user.ts              # 用户类型
│   └── index.ts             # 类型导出
└── styles/                  # 样式文件
    ├── globals.css          # 全局样式
    └── markdown.css         # Markdown 样式
```

### 3.2 文件组织原则
- 相关文件就近放置
- 组件和其样式、测试文件放在同一目录
- 公共组件放在 `components/common`
- 业务组件按功能模块组织

---

## 4. 组件开发规范

### 4.1 组件设计原则
1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 通过 props 控制组件行为
3. **类型安全**: 所有 props 必须有 TypeScript 类型定义
4. **性能优化**: 合理使用 memo、useMemo、useCallback

### 4.2 组件文档规范
```typescript
/**
 * 文章卡片组件
 * @description 用于展示文章摘要信息
 * @example
 * ```tsx
 * <PostCard 
 *   post={postData} 
 *   onClick={(id) => router.push(`/posts/${id}`)}
 * />
 * ```
 */
export const PostCard: FC<PostCardProps> = ({ post, onClick }) => {
  // ...
};
```

### 4.3 Props 设计规范
```typescript
interface ComponentProps {
  // 必需的 props
  title: string;
  content: string;
  
  // 可选的 props - 提供默认值
  status?: 'draft' | 'published';
  
  // 事件处理器 - on 前缀
  onClick?: () => void;
  onChange?: (value: string) => void;
  
  // 布尔值 - is/has 前缀
  isLoading?: boolean;
  hasError?: boolean;
  
  // 渲染函数
  renderHeader?: () => React.ReactNode;
  
  // 子组件
  children?: React.ReactNode;
}
```

---

## 5. Markdown 编辑器规范

### 5.1 编辑器功能要求
```typescript
// 必须支持的功能
const REQUIRED_FEATURES = [
  'heading',          // 标题 (H1-H6)
  'bold',            // 粗体
  'italic',          // 斜体
  'strikethrough',   // 删除线
  'unorderedList',   // 无序列表
  'orderedList',     // 有序列表
  'taskList',        // 任务列表
  'code',            // 行内代码
  'codeBlock',       // 代码块（带语法高亮）
  'blockquote',      // 引用
  'link',            // 链接
  'image',           // 图片
  'table',           // 表格
  'horizontalRule',  // 分割线
  'preview',         // 实时预览
  'fullscreen',      // 全屏编辑
  'export',          // 导出功能
];

// 扩展功能
const EXTENDED_FEATURES = [
  'mermaid',         // 流程图
  'math',            // 数学公式 (KaTeX)
  'toc',             // 目录生成
  'footnote',        // 脚注
  'emoji',           // 表情符号
];
```

### 5.2 编辑器组件实现
```typescript
// components/editor/MarkdownEditor.tsx
import { FC, useState, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { message } from 'antd';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { uploadImage } from '@/lib/api/upload';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import 'highlight.js/styles/github.css';
import 'katex/dist/katex.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value,
  onChange,
  height = 500,
  placeholder = '开始编写你的文章...',
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // 处理图片粘贴/拖拽
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('只能上传图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      const imageMd = `![${file.name}](${url})`;
      
      // 在光标位置插入图片
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = 
          value.substring(0, start) + 
          imageMd + 
          value.substring(end);
        onChange(newValue);
      }
    } catch (error) {
      message.error('图片上传失败');
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange]);

  // 自定义工具栏命令
  const customCommands = [
    {
      name: 'table',
      keyCommand: 'table',
      buttonProps: { 'aria-label': 'Insert table' },
      icon: (
        <svg viewBox="0 0 16 16" width="12" height="12">
          <path d="M0 2v12h16V2H0zm5 10H2v-2h3v2zm0-3H2V7h3v2zm0-3H2V4h3v2zm5 6H6v-2h4v2zm0-3H6V7h4v2zm0-3H6V4h4v2zm4 6h-3v-2h3v2zm0-3h-3V7h3v2zm0-3h-3V4h3v2z" />
        </svg>
      ),
      execute: (state, api) => {
        const table = '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |';
        api.replaceSelection(table);
      },
    },
  ];

  return (
    <div className="markdown-editor-container">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview="live"
        hideToolbar={false}
        enableScroll={true}
        textareaProps={{
          placeholder,
        }}
        previewOptions={{
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            rehypeSanitize,
            rehypeHighlight,
            rehypeKatex,
          ],
        }}
        commands={[
          ...MDEditor.commands,
          ...customCommands,
        ]}
        extraCommands={[
          MDEditor.commands.fullscreen,
        ]}
        onPaste={async (event) => {
          const items = event.clipboardData?.items;
          if (items) {
            for (const item of items) {
              if (item.type.startsWith('image/')) {
                event.preventDefault();
                const file = item.getAsFile();
                if (file) {
                  await handleImageUpload(file);
                }
                break;
              }
            }
          }
        }}
        onDrop={async (event) => {
          const files = event.dataTransfer?.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
              event.preventDefault();
              await handleImageUpload(file);
            }
          }
        }}
      />
      {isUploading && (
        <div className="upload-overlay">
          <span>正在上传图片...</span>
        </div>
      )}
    </div>
  );
};
```

### 5.3 Markdown 样式规范
```css
/* styles/markdown.css */
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 
               'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; border-bottom: 1px solid #eaecef; }
.markdown-body h2 { font-size: 1.5em; }
.markdown-body h3 { font-size: 1.25em; }

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 16px 0;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 16px 0;
}

.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item input {
  margin-right: 0.5em;
}
```

### 5.4 编辑器快捷键
```typescript
// 编辑器快捷键配置
const EDITOR_SHORTCUTS = {
  'Cmd+B': 'bold',
  'Cmd+I': 'italic',
  'Cmd+K': 'link',
  'Cmd+Shift+S': 'strikethrough',
  'Cmd+E': 'code',
  'Cmd+Shift+C': 'codeBlock',
  'Cmd+Shift+L': 'unorderedList',
  'Cmd+Shift+O': 'orderedList',
  'Cmd+Shift+X': 'taskList',
  'Cmd+Shift+.': 'blockquote',
  'Cmd+Enter': 'preview',
  'Cmd+S': 'save',
  'F11': 'fullscreen',
};
```

---

## 6. 状态管理规范

### 6.1 React Query 使用规范
```typescript
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/lib/api/endpoints';

// Query Keys 统一管理
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

// 获取文章列表
export function usePostList(filters: PostFilters) {
  return useQuery({
    queryKey: postKeys.list(JSON.stringify(filters)),
    queryFn: () => postApi.getList(filters),
    staleTime: 5 * 60 * 1000, // 5 分钟
    gcTime: 10 * 60 * 1000,   // 10 分钟
  });
}

// 获取文章详情
export function usePostDetail(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postApi.getDetail(id),
    enabled: !!id,
  });
}

// 创建文章
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postApi.create,
    onSuccess: () => {
      // 刷新文章列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      message.success('文章创建成功');
    },
    onError: (error) => {
      message.error('文章创建失败');
    },
  });
}

// 更新文章
export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) => 
      postApi.update(id, data),
    onSuccess: (data, { id }) => {
      // 更新详情缓存
      queryClient.setQueryData(postKeys.detail(id), data);
      // 刷新列表
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      message.success('文章更新成功');
    },
  });
}
```

### 6.2 全局状态管理
```typescript
// contexts/AppContext.tsx
import { createContext, useContext, useReducer } from 'react';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    sidebarCollapsed: false,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
```

---

## 7. API 集成规范

### 7.1 API 客户端配置
```typescript
// lib/api/client.ts
import axios, { AxiosError } from 'axios';
import { message } from 'antd';
import { getAuthToken, removeAuthToken } from '@/lib/auth';

// API 响应类型
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    const apiResponse: ApiResponse = response.data;
    
    // 业务错误处理
    if (apiResponse.code !== 0) {
      message.error(apiResponse.message);
      return Promise.reject(new Error(apiResponse.message));
    }
    
    return apiResponse.data;
  },
  (error: AxiosError<ApiError>) => {
    // 网络错误处理
    if (!error.response) {
      message.error('网络连接失败，请检查网络设置');
      return Promise.reject(error);
    }
    
    // HTTP 错误处理
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        message.error('登录已过期，请重新登录');
        removeAuthToken();
        window.location.href = '/login';
        break;
      case 403:
        message.error('您没有权限执行此操作');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器错误，请稍后重试');
        break;
      default:
        message.error(data?.message || '请求失败');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 7.2 API 端点定义
```typescript
// lib/api/endpoints.ts
import apiClient from './client';
import { Post, CreatePostInput, UpdatePostInput } from '@/types/post';
import { PaginationParams, PaginatedResponse } from '@/types/api';

export const postApi = {
  // 获取文章列表
  getList: (params: PaginationParams & { status?: string }) => 
    apiClient.get<PaginatedResponse<Post>>('/posts', { params }),
  
  // 获取文章详情
  getDetail: (id: string) => 
    apiClient.get<Post>(`/posts/${id}`),
  
  // 创建文章
  create: (data: CreatePostInput) => 
    apiClient.post<Post>('/posts', data),
  
  // 更新文章
  update: (id: string, data: UpdatePostInput) => 
    apiClient.put<Post>(`/posts/${id}`, data),
  
  // 删除文章
  delete: (id: string) => 
    apiClient.delete(`/posts/${id}`),
  
  // 发布文章
  publish: (id: string) => 
    apiClient.post<Post>(`/posts/${id}/publish`),
  
  // 取消发布
  unpublish: (id: string) => 
    apiClient.post<Post>(`/posts/${id}/unpublish`),
};
```

---

## 8. 样式开发规范

### 8.1 样式方案
- 使用 Ant Design 的设计规范
- 特殊样式使用 CSS Modules
- 避免使用内联样式
- 使用 CSS 变量管理主题色

### 8.2 CSS Modules 使用
```tsx
// components/PostCard.module.css
.card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 组件中使用
import styles from './PostCard.module.css';

<Card className={styles.card}>
  <h3 className={styles.title}>{post.title}</h3>
  <p className={styles.excerpt}>{post.excerpt}</p>
</Card>
```

### 8.3 主题变量定义
```css
/* styles/globals.css */
:root {
  /* 颜色 */
  --primary-color: #1677ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  
  /* 文本颜色 */
  --text-primary: rgba(0, 0, 0, 0.85);
  --text-secondary: rgba(0, 0, 0, 0.45);
  --text-disabled: rgba(0, 0, 0, 0.25);
  
  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-tertiary: #f5f5f5;
  
  /* 边框 */
  --border-color: #d9d9d9;
  --border-radius: 6px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 暗色主题 */
[data-theme='dark'] {
  --text-primary: rgba(255, 255, 255, 0.85);
  --text-secondary: rgba(255, 255, 255, 0.45);
  --bg-primary: #141414;
  --bg-secondary: #1f1f1f;
  --border-color: #303030;
}
```

---

## 9. 性能优化规范

### 9.1 组件优化
```typescript
// 1. 使用 memo 避免不必要的重渲染
export const PostCard = memo(({ post }: PostCardProps) => {
  return <Card>{/* ... */}</Card>;
});

// 2. 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 3. 使用 useCallback 缓存函数
const handleClick = useCallback((id: string) => {
  router.push(`/posts/${id}`);
}, [router]);

// 4. 使用动态导入
const MarkdownEditor = dynamic(
  () => import('@/components/editor/MarkdownEditor'),
  { 
    ssr: false,
    loading: () => <Spin size="large" />
  }
);
```

### 9.2 图片优化
```tsx
import Image from 'next/image';

// 使用 Next.js Image 组件
<Image
  src={post.featuredImage}
  alt={post.title}
  width={800}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL={post.blurDataURL}
/>
```

### 9.3 列表虚拟化
```tsx
// 对于长列表使用虚拟化
import { List } from 'react-virtualized';

<List
  width={width}
  height={600}
  rowCount={posts.length}
  rowHeight={120}
  rowRenderer={({ index, key, style }) => (
    <div key={key} style={style}>
      <PostCard post={posts[index]} />
    </div>
  )}
/>
```

---

## 10. 测试规范

### 10.1 单元测试
```typescript
// __tests__/utils/markdown.test.ts
import { parseMarkdown, extractExcerpt } from '@/lib/utils/markdown';

describe('Markdown Utils', () => {
  describe('parseMarkdown', () => {
    it('should parse markdown to HTML', () => {
      const markdown = '# Hello\n\nThis is **bold** text.';
      const html = parseMarkdown(markdown);
      expect(html).toContain('<h1>Hello</h1>');
      expect(html).toContain('<strong>bold</strong>');
    });
  });
  
  describe('extractExcerpt', () => {
    it('should extract excerpt from content', () => {
      const content = 'This is a long content that needs to be truncated...';
      const excerpt = extractExcerpt(content, 20);
      expect(excerpt).toBe('This is a long conte...');
    });
  });
});
```

### 10.2 组件测试
```typescript
// __tests__/components/PostCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '@/components/post/PostCard';

const mockPost = {
  id: '1',
  title: 'Test Post',
  excerpt: 'This is a test post',
  tags: [{ id: '1', name: 'React', color: 'blue' }],
};

describe('PostCard', () => {
  it('should render post information', () => {
    render(<PostCard post={mockPost} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PostCard post={mockPost} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Post'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```

---

## 11. Git 工作流程

### 11.1 分支管理
```bash
main           # 生产环境分支
├── develop    # 开发分支
├── feature/*  # 功能分支
├── bugfix/*   # Bug 修复分支
└── hotfix/*   # 紧急修复分支
```

### 11.2 提交规范
```bash
# 提交格式
<type>(<scope>): <subject>

# 类型
feat:     新功能
fix:      修复 Bug
docs:     文档更新
style:    代码格式调整
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建工具或辅助工具的变动

# 示例
feat(editor): 添加图片拖拽上传功能
fix(auth): 修复 token 过期后的跳转问题
docs(readme): 更新项目安装说明
```

### 11.3 代码审查清单
- [ ] 代码符合编码规范
- [ ] 有适当的类型定义
- [ ] 有必要的错误处理
- [ ] 有适当的注释
- [ ] 通过所有测试
- [ ] 没有 console.log
- [ ] 没有注释掉的代码
- [ ] 性能影响已考虑

---

## 12. 文档规范

### 12.1 组件文档
每个组件都应该有：
1. 组件描述
2. Props 说明
3. 使用示例
4. 注意事项

### 12.2 API 文档
每个 API 端点都应该有：
1. 端点路径
2. 请求方法
3. 请求参数
4. 响应格式
5. 错误码说明

### 12.3 README 模板
```markdown
# 组件/模块名称

## 简介
简要描述组件/模块的功能和用途

## 安装
```bash
npm install xxx
```

## 使用方法
```typescript
import { Component } from './Component';

<Component prop="value" />
```

## API
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 属性说明 | string | - |

## 注意事项
- 注意事项 1
- 注意事项 2
```

---

## 总结

本规范文档涵盖了 Heimdall Web 项目开发的各个方面，特别强调了：

1. **代码质量**: 通过 TypeScript、ESLint、Prettier 保证代码质量
2. **开发效率**: 通过组件复用、统一规范提高开发效率
3. **用户体验**: 特别加强了 Markdown 编辑器的功能和体验
4. **可维护性**: 通过清晰的项目结构和文档保证长期维护

所有开发人员必须熟悉并遵循这些规范，确保项目的一致性和高质量。