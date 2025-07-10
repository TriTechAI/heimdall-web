# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`heimdall-web` is a modern blog management admin frontend focused on providing an efficient, clean interface for content creators. The project emphasizes strong Markdown editing capabilities and rapid deployment.

### Core Principles
- 🚀 **Fast Development**: Ship in 2-3 weeks (14 working days)
- 🎯 **Core Features Only**: Focus on essential functionality
- 📝 **Powerful Markdown**: Professional writing and formatting tools
- 💎 **Excellent UX**: Smooth interactions and elegant interface
- 🔧 **Maintainable**: Clear architecture with complete type system

## Tech Stack (Optimized v3)

### Core Dependencies
```javascript
{
  // Core Framework
  "next": "14.2.3",
  "react": "18.3.1",
  "typescript": "5.5.4",
  
  // UI Framework - Single Choice
  "antd": "5.20.6",
  "@ant-design/icons": "5.4.0",
  "@ant-design/pro-components": "2.7.0", // Advanced business components
  
  // State Management - Simplified
  "@tanstack/react-query": "5.51.0", // Server state
  // Client state: React Context + useReducer (built-in)
  
  // Markdown Editor - Feature Complete
  "@uiw/react-md-editor": "4.0.4",
  "react-markdown": "9.0.1",
  "remark-gfm": "4.0.0",
  "rehype-highlight": "7.0.0",
  "rehype-katex": "7.0.0",
  "katex": "0.16.11",
  
  // Core Utilities
  "axios": "1.7.7",
  "dayjs": "1.11.13",
  "zod": "3.23.8",
  "ahooks": "3.8.0" // React Hooks utility library
}
```

## Architecture Design

### Layered Architecture
```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│    (Pages, Components, Hooks)           │
├─────────────────────────────────────────┤
│          Business Logic Layer           │
│    (Services, State Management)         │
├─────────────────────────────────────────┤
│           Data Access Layer             │
│    (API Client, Type Definitions)       │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │
│    (Auth, Utils, Constants)             │
└─────────────────────────────────────────┘
```

### Optimized Project Structure
```
heimdall-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages group
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/       # Admin dashboard group
│   │   │   ├── layout.tsx     # Unified layout
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── posts/         # Post management
│   │   │   ├── tags/          # Tag management
│   │   │   ├── comments/      # Comment management
│   │   │   └── users/         # User management
│   │   ├── api/               # API routes (optional)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # Component library
│   │   ├── common/           # Common components
│   │   │   ├── PageHeader/
│   │   │   ├── DataTable/
│   │   │   ├── SearchBar/
│   │   │   └── index.ts
│   │   ├── layout/           # Layout components
│   │   │   ├── DashboardLayout/
│   │   │   ├── Sidebar/
│   │   │   └── Header/
│   │   ├── editor/           # Editor components
│   │   │   ├── MarkdownEditor/
│   │   │   ├── ImageUploader/
│   │   │   └── EditorToolbar/
│   │   └── features/         # Business components
│   │       ├── post/
│   │       ├── tag/
│   │       └── comment/
│   │
│   ├── services/             # Business service layer
│   │   ├── api/             # API services
│   │   │   ├── client.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── post.service.ts
│   │   │   ├── tag.service.ts
│   │   │   ├── comment.service.ts
│   │   │   └── user.service.ts
│   │   └── hooks/           # Business Hooks
│   │       ├── useAuth.ts
│   │       ├── usePosts.ts
│   │       └── index.ts
│   │
│   ├── lib/                 # Infrastructure layer
│   │   ├── auth/           # Auth utilities
│   │   ├── utils/          # Helper functions
│   │   ├── constants/      # Constants
│   │   └── validators/     # Validators
│   │
│   ├── types/              # Type definitions
│   │   ├── api/           # API types
│   │   ├── models/        # Data models
│   │   └── index.ts       # Unified export
│   │
│   └── styles/            # Style files
│       ├── antd-theme.ts  # Ant Design theme
│       └── markdown.css   # Markdown styles
```

## Module & API Mapping

### Authentication Module
| Feature | Method | Endpoint | Request | Response |
|---------|--------|----------|---------|----------|
| Login | POST | `/api/v1/admin/auth/login` | `{username, password, rememberMe?}` | `{token, refreshToken, user}` |
| Logout | POST | `/api/v1/admin/auth/logout` | `{refreshToken}` | `{message}` |
| Refresh Token | POST | `/api/v1/admin/auth/refresh` | `{refreshToken}` | `{token, refreshToken, user}` |
| Get Profile | GET | `/api/v1/admin/auth/profile` | - | `{user}` |
| Change Password | POST | `/api/v1/admin/auth/change-password` | `{currentPassword, newPassword}` | `{message}` |

### Post Module
| Feature | Method | Endpoint | Request | Response |
|---------|--------|----------|---------|----------|
| List Posts | GET | `/api/v1/admin/posts` | `{page, limit, status?, tag?, keyword?}` | `{list, pagination}` |
| Get Post | GET | `/api/v1/admin/posts/{id}` | - | `Post` |
| Create Post | POST | `/api/v1/admin/posts` | `CreatePostInput` | `Post` |
| Update Post | PUT | `/api/v1/admin/posts/{id}` | `UpdatePostInput` | `Post` |
| Delete Post | DELETE | `/api/v1/admin/posts/{id}` | - | `{message}` |
| Publish | POST | `/api/v1/admin/posts/{id}/publish` | `{publishedAt?}` | `Post` |
| Unpublish | POST | `/api/v1/admin/posts/{id}/unpublish` | - | `Post` |

### Other Modules
- **Tags**: CRUD operations at `/api/v1/admin/tags`
- **Comments**: Moderation at `/api/v1/admin/comments`
- **Users**: Management at `/api/v1/admin/users`
- **Security**: Login logs at `/api/v1/admin/security`

## Development Standards

### Coding Conventions

#### Naming Rules
```typescript
// Files
ComponentName.tsx      // Components - PascalCase
useHookName.ts        // Hooks - camelCase with 'use' prefix
serviceName.ts        // Services - camelCase
typeName.types.ts     // Types - camelCase

// Variables
const MAX_RETRY_COUNT = 3;      // Constants - UPPER_SNAKE_CASE
const isLoading = false;        // Booleans - is/has prefix
const handleSubmit = () => {};  // Event handlers - handle prefix
const postList = [];            // Arrays - plural names
```

#### TypeScript Best Practices
```typescript
// ✅ Good - Use explicit types
interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
}

// ❌ Bad - Avoid any
const data: any = fetchData();

// ✅ Good - Use unknown for dynamic data
const data: unknown = fetchData();
```

#### Component Template
```typescript
import { FC, memo } from 'react';
import { Card } from 'antd';

interface PostCardProps {
  post: Post;
  onClick?: (id: string) => void;
}

export const PostCard: FC<PostCardProps> = memo(({ post, onClick }) => {
  const handleClick = () => {
    onClick?.(post.id);
  };

  return (
    <Card onClick={handleClick}>
      {/* content */}
    </Card>
  );
});

PostCard.displayName = 'PostCard';
```

### State Management

#### React Query for Server State
```typescript
// services/hooks/usePosts.ts
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
};

export function usePostList(params: PostQueryParams) {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: () => postService.getList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### Context for Client State
```typescript
// contexts/AppContext.tsx
interface AppState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

const AppContext = createContext<AppState>({
  sidebarCollapsed: false,
  theme: 'light'
});

export const useAppState = () => useContext(AppContext);
```

### API Integration

#### Unified API Client
```typescript
// services/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    message.error(error.response?.data?.message || 'Request failed');
    return Promise.reject(error);
  }
);
```

### Markdown Editor Requirements

#### Must-Have Features
- Bold, italic, strikethrough, code
- Headings (H1-H6), lists, blockquotes
- Tables, code blocks with syntax highlighting
- Image upload via drag/drop and paste
- Live side-by-side preview
- Keyboard shortcuts for all actions
- Auto-save drafts

#### Implementation
```typescript
// components/editor/MarkdownEditor.tsx
import MDEditor from '@uiw/react-md-editor';
import { message } from 'antd';

export const MarkdownEditor: FC<EditorProps> = ({ value, onChange }) => {
  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size must be less than 5MB');
      return;
    }
    
    const url = await uploadImage(file);
    return `![${file.name}](${url})`;
  };

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      preview="live"
      height={500}
      onPaste={handlePaste}
      onDrop={handleDrop}
    />
  );
};
```

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const PostEditor = dynamic(
  () => import('@/components/editor/PostEditor'),
  { 
    loading: () => <Skeleton active />,
    ssr: false 
  }
);
```

### List Virtualization
```typescript
// For long lists
import { List } from 'react-virtualized';

<List
  height={600}
  rowCount={posts.length}
  rowHeight={80}
  rowRenderer={({ index, key, style }) => (
    <div key={key} style={style}>
      <PostCard post={posts[index]} />
    </div>
  )}
/>
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src={post.featuredImage}
  alt={post.title}
  width={800}
  height={400}
  loading="lazy"
  placeholder="blur"
/>
```

## Git Workflow

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feat/*` - Feature branches
- `fix/*` - Bug fix branches
- `refactor/*` - Refactoring branches

### Commit Convention
```bash
feat: add batch delete for posts
fix: resolve tag selector search issue
refactor: optimize API error handling
style: improve mobile responsive layout
docs: update deployment guide
chore: upgrade dependencies
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format

# Run tests (when added)
npm run test
```

## Important Guidelines

### Do's
- ✅ Keep components small and focused (< 200 lines)
- ✅ Use Ant Design components without unnecessary wrappers
- ✅ Implement proper loading and error states
- ✅ Add TypeScript types for all data
- ✅ Follow the established file structure
- ✅ Write meaningful commit messages
- ✅ Test on mobile devices

### Don'ts
- ❌ Don't over-engineer simple features
- ❌ Don't add features outside MVP scope
- ❌ Don't ignore TypeScript errors
- ❌ Don't use inline styles (use CSS modules or styled-components)
- ❌ Don't commit sensitive data
- ❌ Don't skip error handling
- ❌ Don't forget accessibility (ARIA labels, keyboard navigation)

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.heimdall.com
   NEXT_PUBLIC_APP_NAME=Heimdall Admin
   ```
3. Enable automatic deployments
4. Configure custom domain

### Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/admin
NEXT_PUBLIC_APP_NAME=Heimdall Admin Dev

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.heimdall.com/api/v1/admin
NEXT_PUBLIC_APP_NAME=Heimdall Admin
```

## Security Checklist

- [ ] All API calls use HTTPS
- [ ] Sensitive data in environment variables only
- [ ] Input validation on all forms (using zod)
- [ ] XSS protection in Markdown rendering
- [ ] CSRF protection for state-changing operations
- [ ] Proper authentication checks on protected routes
- [ ] Rate limiting on API calls
- [ ] No console.log in production code

## Quality Checklist

Before committing:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] All components have proper TypeScript types
- [ ] Error states are handled gracefully
- [ ] Loading states are implemented
- [ ] Code follows naming conventions
- [ ] New features are responsive
- [ ] Accessibility requirements are met

## Current Tasks

See `/docs/project-tasks-v2.md` for detailed task breakdown.

### Quick Start
1. **Phase 1** (3.5 days): Project setup, auth, basic layout
2. **Phase 2** (4.5 days): Post management, Markdown editor
3. **Phase 3** (3 days): Tags, comments, users
4. **Phase 4** (3 days): Optimization, testing, deployment

## References

- Architecture Design: `/docs/architecture-design-v3.md`
- Module API Mapping: `/docs/module-api-mapping.md`
- API Specification: `/docs/admin-api.yaml`
- Development Standards: `/docs/development-standards.md`
- Task List: `/docs/project-tasks-v2.md`

## AI Assistant Notes

When assisting with this project:
1. Follow the established architecture and file structure
2. Use Ant Design components for UI
3. Implement proper TypeScript types
4. Add loading and error states for all async operations
5. Follow the Git commit convention
6. Ensure mobile responsiveness
7. Keep performance in mind (lazy loading, virtualization)
8. Test features before marking tasks complete