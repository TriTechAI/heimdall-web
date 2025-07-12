// Comment status enum
export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

// Comment visibility enum
export type CommentVisibility = 'public' | 'private';

// Comment type enum
export type CommentType = 'comment' | 'reply';

// Base comment interface
export interface Comment {
  id: string;
  postId: string;
  parentId?: string;  // For nested comments
  content: string;
  
  // Author information
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  authorIp: string;
  userAgent: string;
  
  // Status and visibility
  status: CommentStatus;
  visibility: CommentVisibility;
  type: CommentType;
  level: number;  // Nesting level
  
  // Statistics
  replyCount: number;
  likeCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  
  // Relations
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  replies?: Comment[];  // Nested replies
}

// Comment creation input
export interface CreateCommentInput {
  postId: string;
  parentId?: string;
  content: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
}

// Comment update input
export interface UpdateCommentInput {
  content?: string;
  status?: CommentStatus;
  visibility?: CommentVisibility;
}

// Comment approve/reject request
export interface CommentModerationRequest {
  ids: string[];
  action: 'approve' | 'reject' | 'spam';
}

// Comment query parameters
export interface CommentQueryParams {
  page?: number;
  limit?: number;
  postId?: string;
  status?: CommentStatus;
  visibility?: CommentVisibility;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

// Comment list response
export interface CommentListResponse {
  list: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Comment statistics
export interface CommentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  spam: number;
}