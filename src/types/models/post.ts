// Post status enum
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

// Post visibility enum  
export type PostVisibility = 'public' | 'members_only' | 'private';

// Post type enum
export type PostType = 'post' | 'page';

// Author info embedded in Post
export interface AuthorInfo {
  id: string;
  username: string;
  displayName: string;
  profileImage?: string;
}

// Tag info embedded in Post
export interface TagInfo {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

// Base post interface
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  markdown: string;      // Changed from 'content' to 'markdown'
  html: string;          // Added HTML field
  type: PostType;        // Added type field
  status: PostStatus;
  visibility: PostVisibility;
  featuredImage?: string;
  
  // Author information
  authorId: string;
  author?: AuthorInfo;   // Updated to use AuthorInfo
  
  // Tags
  tags?: TagInfo[];      // Updated to use TagInfo
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;  // Changed from metaKeywords
  
  // Statistics
  readingTime: number;    // Added
  wordCount: number;      // Added
  viewCount: number;
  
  // Timestamps
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  featuredImage?: string;    // Added
  metaTitle?: string;        // Added
  metaDescription?: string;  // Added
  visibility: 'public' | 'internal';  // Added
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

// Post creation input
export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  markdown: string;      // Changed from 'content' to 'markdown'
  type: PostType;        // Added
  status: PostStatus;
  visibility: PostVisibility;
  featuredImage?: string;
  publishedAt?: string;
  tagIds?: string[];
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;  // Changed from metaKeywords
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
  page?: number;         // Changed from 'page' to match backend
  limit?: number;        // Changed from 'limit' to match backend
  status?: PostStatus;
  visibility?: PostVisibility;
  type?: PostType;       // Added
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
    page: number;       // Changed from 'current' to 'page'
    limit: number;      // Changed from 'pageSize' to 'limit'
    total: number;
    hasNext: boolean;   // Added
    hasPrev: boolean;   // Added
  };
}