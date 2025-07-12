// Tag visibility enum
export type TagVisibility = 'public' | 'internal';

// Base tag interface
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  visibility: TagVisibility;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

// Tag creation input
export interface CreateTagInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  visibility?: TagVisibility;
}

// Tag update input
export interface UpdateTagInput extends Partial<CreateTagInput> {}

// Tag query parameters
export interface TagQueryParams {
  page?: number;
  limit?: number;
  keyword?: string;
  visibility?: TagVisibility;
  sortBy?: 'name' | 'postCount' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Tag list response
export interface TagListResponse {
  list: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}