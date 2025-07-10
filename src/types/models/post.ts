// Post status enum
export type PostStatus = 'draft' | 'published' | 'archived';

// Post visibility enum  
export type PostVisibility = 'public' | 'private' | 'password';

// Base post interface
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  visibility: PostVisibility;
  password?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: {
    id: string;
    username: string;
    email: string;
  };
  tags?: Tag[];
  viewCount: number;
  commentCount: number;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

// Post creation input
export interface CreatePostInput {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  status: PostStatus;
  visibility: PostVisibility;
  password?: string;
  featuredImage?: string;
  publishedAt?: string;
  tagIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

// Post update input
export interface UpdatePostInput extends Partial<CreatePostInput> {}

// Post update with ID
export interface UpdatePostRequest {
  id: string;
  data: UpdatePostInput;
}

// Post query parameters
export interface PostQueryParams {
  page?: number;
  limit?: number;
  status?: PostStatus;
  visibility?: PostVisibility;
  tagId?: string;
  authorId?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// Post list response
export interface PostListResponse {
  list: Post[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}