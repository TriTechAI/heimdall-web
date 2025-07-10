# Heimdall Web 模块与API接口对应文档

> **版本**: 1.0  
> **更新日期**: 2025-07-10  
> **说明**: 本文档详细描述了前端模块与后端API接口的对应关系

## 1. 模块总览

| 模块名称 | 功能描述 | API前缀 | 主要页面 |
|---------|---------|---------|---------|
| 认证模块 | 用户登录、登出、Token管理 | `/api/v1/admin/auth` | `/login` |
| 文章模块 | 文章的增删改查、发布管理 | `/api/v1/admin/posts` | `/posts/*` |
| 页面模块 | 静态页面管理 | `/api/v1/admin/pages` | `/pages/*` |
| 标签模块 | 标签的增删改查 | `/api/v1/admin/tags` | `/tags/*` |
| 评论模块 | 评论审核与管理 | `/api/v1/admin/comments` | `/comments/*` |
| 用户模块 | 用户管理与权限控制 | `/api/v1/admin/users` | `/users/*` |
| 安全模块 | 登录日志与安全审计 | `/api/v1/admin/security` | `/security/*` |

## 2. 认证模块 (Auth Module)

### 2.1 模块结构
```
auth/
├── pages/
│   └── login/           # 登录页面
├── components/
│   ├── LoginForm/       # 登录表单
│   └── RememberMe/      # 记住我组件
├── services/
│   └── auth.service.ts  # 认证服务
└── hooks/
    └── useAuth.ts       # 认证Hook
```

### 2.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 用户登录 | POST | `/auth/login` | `{username, password, rememberMe?}` | `{token, refreshToken, user, expiresIn}` |
| 用户登出 | POST | `/auth/logout` | `{refreshToken}` | `{message}` |
| 刷新Token | POST | `/auth/refresh` | `{refreshToken}` | `{token, refreshToken, user}` |
| 获取用户信息 | GET | `/auth/profile` | - | `{user}` |
| 修改密码 | POST | `/auth/change-password` | `{currentPassword, newPassword, confirmPassword}` | `{message}` |

### 2.3 前端实现示例
```typescript
// services/auth.service.ts
export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    return apiClient.post('/auth/login', credentials);
  },
  
  async logout(refreshToken: string): Promise<void> {
    return apiClient.post('/auth/logout', { refreshToken });
  },
  
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post('/auth/refresh', { refreshToken });
  },
  
  async getProfile(): Promise<User> {
    return apiClient.get('/auth/profile');
  },
  
  async changePassword(data: ChangePasswordInput): Promise<void> {
    return apiClient.post('/auth/change-password', data);
  }
};

// hooks/useAuth.ts
export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: authService.getProfile,
    staleTime: 5 * 60 * 1000
  });
  
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // 保存Token
      setAuthToken(data.token);
      // 刷新用户信息
      queryClient.invalidateQueries(['auth']);
    }
  });
  
  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    logout: useLogout()
  };
}
```

## 3. 文章模块 (Post Module)

### 3.1 模块结构
```
posts/
├── pages/
│   ├── list/            # 文章列表页
│   ├── create/          # 创建文章页
│   └── [id]/
│       └── edit/        # 编辑文章页
├── components/
│   ├── PostTable/       # 文章表格
│   ├── PostForm/        # 文章表单
│   ├── PostEditor/      # Markdown编辑器
│   └── PostPreview/     # 文章预览
├── services/
│   └── post.service.ts  # 文章服务
└── hooks/
    ├── usePosts.ts      # 文章列表Hook
    └── usePost.ts       # 单篇文章Hook
```

### 3.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 获取文章列表 | GET | `/posts` | `{page, limit, status?, type?, tag?, keyword?, sortBy?, sortDesc?}` | `{list: Post[], pagination}` |
| 获取文章详情 | GET | `/posts/{id}` | - | `Post` |
| 创建文章 | POST | `/posts` | `CreatePostInput` | `Post` |
| 更新文章 | PUT | `/posts/{id}` | `UpdatePostInput` | `Post` |
| 删除文章 | DELETE | `/posts/{id}` | - | `{message}` |
| 发布文章 | POST | `/posts/{id}/publish` | `{publishedAt?}` | `Post` |
| 取消发布 | POST | `/posts/{id}/unpublish` | - | `Post` |

### 3.3 类型定义
```typescript
// types/post.ts
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  markdown: string;
  html: string;
  featuredImage: string;
  type: 'post' | 'page';
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  visibility: 'public' | 'members_only' | 'private';
  author: Author;
  tags: Tag[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  readingTime: number;
  wordCount: number;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  markdown: string;
  excerpt?: string;
  featuredImage?: string;
  type: 'post' | 'page';
  status: 'draft' | 'published';
  visibility: 'public' | 'members_only' | 'private';
  tags?: Tag[];
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  publishedAt?: string;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}
```

### 3.4 前端实现示例
```typescript
// services/post.service.ts
export const postService = {
  async getList(params: PostQueryParams): Promise<PostListResponse> {
    return apiClient.get('/posts', { params });
  },
  
  async getDetail(id: string): Promise<Post> {
    return apiClient.get(`/posts/${id}`);
  },
  
  async create(data: CreatePostInput): Promise<Post> {
    return apiClient.post('/posts', data);
  },
  
  async update(id: string, data: UpdatePostInput): Promise<Post> {
    return apiClient.put(`/posts/${id}`, data);
  },
  
  async delete(id: string): Promise<void> {
    return apiClient.delete(`/posts/${id}`);
  },
  
  async publish(id: string, publishedAt?: string): Promise<Post> {
    return apiClient.post(`/posts/${id}/publish`, { publishedAt });
  },
  
  async unpublish(id: string): Promise<Post> {
    return apiClient.post(`/posts/${id}/unpublish`);
  }
};

// hooks/usePosts.ts
export function usePosts(params: PostQueryParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postService.getList(params),
    keepPreviousData: true
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postService.getDetail(id),
    enabled: !!id
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      message.success('文章创建成功');
    }
  });
}
```

## 4. 标签模块 (Tag Module)

### 4.1 模块结构
```
tags/
├── pages/
│   └── list/            # 标签列表页
├── components/
│   ├── TagTable/        # 标签表格
│   ├── TagForm/         # 标签表单
│   └── TagSelect/       # 标签选择器
├── services/
│   └── tag.service.ts   # 标签服务
└── hooks/
    └── useTags.ts       # 标签Hook
```

### 4.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 获取标签列表 | GET | `/tags` | `{page, limit, name?, visibility?, sortBy?, sortDesc?}` | `{list: Tag[], pagination}` |
| 获取标签详情 | GET | `/tags/{id}` | - | `Tag` |
| 创建标签 | POST | `/tags` | `CreateTagInput` | `Tag` |
| 更新标签 | PUT | `/tags/{id}` | `UpdateTagInput` | `Tag` |
| 删除标签 | DELETE | `/tags/{id}` | - | `{message}` |

### 4.3 类型定义
```typescript
// types/tag.ts
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  postCount: number;
  visibility: 'public' | 'internal';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  visibility: 'public' | 'internal';
}
```

## 5. 评论模块 (Comment Module)

### 5.1 模块结构
```
comments/
├── pages/
│   └── moderation/      # 评论审核页
├── components/
│   ├── CommentList/     # 评论列表
│   ├── CommentDetail/   # 评论详情
│   └── ModerationPanel/ # 审核面板
├── services/
│   └── comment.service.ts
└── hooks/
    └── useComments.ts
```

### 5.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 获取评论列表 | GET | `/comments` | `CommentQueryParams` | `{list: Comment[], pagination}` |
| 获取评论详情 | GET | `/comments/{id}` | - | `Comment` |
| 更新评论 | PUT | `/comments/{id}` | `UpdateCommentInput` | `Comment` |
| 删除评论 | DELETE | `/comments/{id}` | `{reason?}` | `{message}` |
| 批准评论 | PUT | `/comments/{id}/approve` | `{reason?}` | `{message}` |
| 拒绝评论 | PUT | `/comments/{id}/reject` | `{reason?}` | `{message}` |
| 标记垃圾评论 | PUT | `/comments/{id}/spam` | `{reason?}` | `{message}` |
| 批量操作 | POST | `/comments/batch` | `{ids, action, reason?}` | `{successful, failed}` |

### 5.3 类型定义
```typescript
// types/comment.ts
export interface Comment {
  id: string;
  postId: string;
  parentId: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite: string;
  authorIP: string;
  userAgent: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  visibility: 'public' | 'private';
  type: 'comment' | 'reply';
  level: number;
  replyCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  approvedAt: string;
}

export interface CommentQueryParams extends PaginationParams {
  postId?: string;
  parentId?: string;
  authorEmail?: string;
  authorIP?: string;
  status?: Comment['status'];
  visibility?: Comment['visibility'];
  type?: Comment['type'];
  level?: number;
  keyword?: string;
  startTime?: string;
  endTime?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'approvedAt' | 'replyCount' | 'likeCount';
}
```

## 6. 用户模块 (User Module)

### 6.1 模块结构
```
users/
├── pages/
│   ├── list/            # 用户列表页
│   └── [id]/
│       └── detail/      # 用户详情页
├── components/
│   ├── UserTable/       # 用户表格
│   ├── UserForm/        # 用户表单
│   └── RoleSelect/      # 角色选择器
├── services/
│   └── user.service.ts
└── hooks/
    └── useUsers.ts
```

### 6.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 获取用户列表 | GET | `/users` | `{page, limit, role?, status?, keyword?, sortBy?, sortDesc?}` | `{list: User[], pagination}` |
| 获取用户详情 | GET | `/users/{id}` | - | `User` |
| 创建用户 | POST | `/users` | `CreateUserInput` | `User` |
| 更新用户 | PUT | `/users/{id}` | `UpdateUserInput` | `User` |
| 删除用户 | DELETE | `/users/{id}` | - | `{message}` |
| 重置密码 | POST | `/users/{id}/reset-password` | `{newPassword, forceChange, reason?}` | `{message}` |
| 修改角色 | PUT | `/users/{id}/role` | `{role, reason?}` | `{message}` |
| 修改状态 | PUT | `/users/{id}/status` | `{status, reason?}` | `{message}` |
| 锁定账户 | POST | `/users/{id}/lock` | `{lockDuration, lockReason?}` | `{message}` |
| 解锁账户 | POST | `/users/{id}/unlock` | `{reason?}` | `{message}` |

### 6.3 类型定义
```typescript
// types/user.ts
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'admin' | 'editor' | 'author';
  profileImage: string;
  bio: string;
  location: string;
  website: string;
  twitter: string;
  facebook: string;
  status: 'active' | 'inactive' | 'locked';
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: User['role'];
  status: User['status'];
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  facebook?: string;
}
```

## 7. 安全模块 (Security Module)

### 7.1 模块结构
```
security/
├── pages/
│   └── login-logs/      # 登录日志页
├── components/
│   ├── LogTable/        # 日志表格
│   └── LogFilters/      # 日志筛选器
├── services/
│   └── security.service.ts
└── hooks/
    └── useLoginLogs.ts
```

### 7.2 API接口映射

| 功能 | 方法 | 接口路径 | 请求参数 | 响应数据 |
|------|------|---------|----------|----------|
| 获取登录日志 | GET | `/security/login-logs` | `LoginLogQueryParams` | `{list: LoginLog[], pagination}` |

### 7.3 类型定义
```typescript
// types/security.ts
export interface LoginLog {
  id: string;
  userId: string;
  username: string;
  loginMethod: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  failReason: string;
  sessionId: string;
  country: string;
  region: string;
  city: string;
  deviceType: string;
  browser: string;
  os: string;
  loginAt: string;
  logoutAt: string;
  duration: number;
}

export interface LoginLogQueryParams extends PaginationParams {
  userId?: string;
  username?: string;
  status?: LoginLog['status'];
  ipAddress?: string;
  startTime?: string;
  endTime?: string;
  country?: string;
  deviceType?: string;
  browser?: string;
  sortBy?: 'loginAt' | 'username' | 'ipAddress' | 'status';
}
```

## 8. 通用类型定义

### 8.1 分页参数
```typescript
// types/api.ts
export interface PaginationParams {
  page: number;      // 页码，从1开始
  limit: number;     // 每页数量
  sortBy?: string;   // 排序字段
  sortDesc?: boolean; // 是否降序
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ListResponse<T> {
  list: T[];
  pagination: PaginationResponse;
}
```

### 8.2 错误处理
```typescript
// types/error.ts
export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export enum ErrorCode {
  // 认证错误
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  
  // 客户端错误
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CONFLICT = 409,
  
  // 服务端错误
  INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  
  // 业务错误
  VALIDATION_ERROR = 1001,
  BUSINESS_ERROR = 1002,
  RATE_LIMIT_ERROR = 1003
}
```

## 9. API调用最佳实践

### 9.1 统一的API客户端
```typescript
// lib/api/client.ts
import axios from 'axios';
import { message } from 'antd';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/admin',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401) {
      // 跳转登录
      window.location.href = '/login';
    } else {
      message.error(error.response?.data?.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 9.2 React Query配置
```typescript
// lib/query/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5分钟
      cacheTime: 10 * 60 * 1000,     // 10分钟
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});
```

### 9.3 错误边界处理
```typescript
// components/ErrorBoundary.tsx
export class ApiErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    if (error.name === 'ApiError') {
      return { hasError: true, error };
    }
    return null;
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('API Error:', error, errorInfo);
    // 上报错误
    reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## 10. 性能优化建议

### 10.1 请求优化
- 使用React Query的缓存机制减少重复请求
- 实现请求去重和防抖
- 对列表数据实现分页加载
- 使用乐观更新提升体验

### 10.2 数据预加载
```typescript
// 预加载标签数据
export function usePreloadTags() {
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['tags'],
      queryFn: tagService.getList
    });
  }, []);
}
```

### 10.3 批量操作优化
```typescript
// 批量删除优化
export function useBatchDelete() {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // 并发删除
      await Promise.all(ids.map(id => postService.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    }
  });
}
```

## 11. 总结

本文档详细描述了Heimdall Web前端各模块与后端API的对应关系，包括：

1. **完整的模块划分**: 7大核心模块，覆盖所有管理功能
2. **详细的API映射**: 每个接口的请求参数和响应格式
3. **类型安全保障**: 完整的TypeScript类型定义
4. **最佳实践示例**: 实际的代码实现参考
5. **性能优化建议**: 提升应用性能的具体方案

开发时请严格按照本文档的接口定义进行对接，确保前后端的一致性。