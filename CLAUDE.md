# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`heimdall-web` is a modern blog management admin frontend focused on providing an efficient, clean interface for content creators. The project emphasizes strong Markdown editing capabilities and rapid deployment.

### Core Principles
- 🚀 **Fast Development**: Ship in 2-3 weeks
- 🎯 **Core Features Only**: Focus on essential functionality
- 📝 **Powerful Markdown**: Professional writing and formatting tools
- 🧩 **Mature Components**: Use battle-tested UI libraries

## Tech Stack

### Simplified Stack (Updated)
```javascript
{
  // Core
  "next": "14.2.x",
  "react": "18.3.x",
  "typescript": "5.5.x",
  
  // UI - Single component library
  "antd": "5.20.x",
  "@ant-design/icons": "5.4.x",
  
  // State Management
  "@tanstack/react-query": "5.51.x",  // Server state
  // Client state: React Context + useReducer (built-in)
  
  // Markdown Editor - Feature-rich
  "@uiw/react-md-editor": "4.0.x",
  "react-markdown": "9.0.x",
  "remark-gfm": "4.0.x",
  "rehype-highlight": "7.0.x",
  "katex": "0.16.x",
  "rehype-katex": "7.0.x",
  
  // Essentials
  "axios": "1.7.x",
  "dayjs": "1.11.x",
  "zod": "3.23.x"
}
```

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login)
│   ├── (admin)/             # Admin pages
│   │   ├── layout.tsx       # Admin layout
│   │   ├── posts/           # Post management
│   │   ├── tags/            # Tag management
│   │   ├── comments/        # Comment moderation
│   │   └── users/           # User management
│   └── api/                 # API routes (if needed)
├── components/              
│   ├── common/              # Common components
│   ├── layout/              # Layout components
│   ├── editor/              # Markdown editor
│   └── post/                # Post-related components
├── hooks/                   # Custom hooks
├── lib/                     # Core utilities
│   ├── api/                 # API client
│   ├── utils/               # Helper functions
│   └── constants/           # Constants
├── types/                   # TypeScript types
└── styles/                  # Global styles
```

## Development Standards

### Coding Conventions

#### Naming Conventions
- **Components**: PascalCase (`PostEditor.tsx`)
- **Utilities**: camelCase (`apiClient.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Hooks**: usePrefix (`usePostData`)

#### TypeScript Rules
```typescript
// Always use explicit types
interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
}

// Avoid any
const data: unknown = fetchData(); // ✅
const data: any = fetchData();     // ❌
```

#### Component Template
```typescript
import { FC, memo } from 'react';

interface ComponentProps {
  title: string;
  onSave?: (value: string) => void;
}

export const Component: FC<ComponentProps> = memo(({ title, onSave }) => {
  return <div>{title}</div>;
});

Component.displayName = 'Component';
```

### Markdown Editor Requirements

#### Core Features (Must Have)
- **Editing**: Bold, italic, strikethrough, code
- **Structure**: Headings (H1-H6), lists, blockquotes
- **Advanced**: Tables, code blocks with syntax highlighting
- **Media**: Image upload via drag/drop and paste
- **Preview**: Live side-by-side preview
- **Shortcuts**: Keyboard shortcuts for all actions

#### Extended Features
- **Math**: KaTeX support for mathematical formulas
- **Diagrams**: Mermaid support (if time permits)
- **Export**: Export to HTML/PDF

#### Editor Implementation
```typescript
// components/editor/MarkdownEditor.tsx
import MDEditor from '@uiw/react-md-editor';

export const MarkdownEditor: FC<Props> = ({ value, onChange }) => {
  const handleImageUpload = async (file: File) => {
    // Handle image upload
    const url = await uploadImage(file);
    return `![${file.name}](${url})`;
  };

  return (
    <MDEditor
      value={value}
      onChange={onChange}
      preview="live"
      height={500}
      // ... configuration
    />
  );
};
```

### State Management

#### React Query for Server State
```typescript
// hooks/usePosts.ts
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
};

export function usePostList(filters: Filters) {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: () => postApi.getList(filters),
  });
}
```

#### Context for Simple Client State
```typescript
// contexts/AppContext.tsx
const AppContext = createContext<AppState>({});

export function useAppState() {
  return useContext(AppContext);
}
```

### API Integration

#### API Client Setup
```typescript
// lib/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Add interceptors for auth and error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Performance Guidelines

1. **Use React.memo** for expensive components
2. **Implement virtualization** for long lists
3. **Lazy load** the Markdown editor
4. **Optimize images** with Next.js Image
5. **Code split** by route

### Git Workflow

#### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - New features
- `bugfix/*` - Bug fixes

#### Commit Convention
```
feat: add image upload to editor
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: simplify post API logic
```

## Development Phases

### Phase 1: Core (Week 1)
1. Project setup with Next.js
2. Authentication system
3. Post CRUD with Markdown editor
4. Basic admin layout

### Phase 2: Extended (Week 2)
1. Tag management
2. Comment moderation
3. User management
4. Testing and optimization

### Phase 3: Polish (Week 3)
1. Performance optimization
2. Error handling
3. Deployment setup
4. Documentation

## Key Implementation Files

### Priority Files to Create
1. `/lib/api/client.ts` - API client with interceptors
2. `/components/editor/MarkdownEditor.tsx` - Full-featured editor
3. `/app/(admin)/layout.tsx` - Admin layout with navigation
4. `/hooks/useAuth.ts` - Authentication hook
5. `/app/(admin)/posts/page.tsx` - Post list with table

## Commands

```bash
# Development
pnpm dev

# Build
pnpm build

# Lint & Format
pnpm lint
pnpm format

# Type Check
pnpm type-check

# Test
pnpm test
```

## Important Guidelines

### Do's
- ✅ Keep components small and focused
- ✅ Use Ant Design components directly
- ✅ Implement proper error boundaries
- ✅ Add loading states for all async operations
- ✅ Write TypeScript types for all data

### Don'ts
- ❌ Don't over-engineer solutions
- ❌ Don't add features not in MVP scope
- ❌ Don't ignore TypeScript errors
- ❌ Don't use inline styles
- ❌ Don't forget error handling

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_NAME`
4. Deploy

### Docker Alternative
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Security Checklist

- [ ] API keys in environment variables only
- [ ] Input validation on all forms
- [ ] XSS protection in Markdown rendering
- [ ] CSRF tokens for state-changing operations
- [ ] Proper authentication checks
- [ ] Rate limiting on API calls

## Quality Checklist

Before committing code:
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Components have proper types
- [ ] Error states are handled
- [ ] Loading states are shown
- [ ] Code follows naming conventions
- [ ] Markdown editor works smoothly

## References

- Design Doc: `/docs/design-v2.md`
- API Spec: `/docs/admin-api.yaml`
- Dev Standards: `/docs/development-standards.md`