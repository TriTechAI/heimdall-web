# Heimdall Web - Blog Management Admin

A modern blog management admin interface built with Next.js 14, TypeScript, Ant Design, and React Query.

## 🚀 Features

### ✅ Completed Features

- **Authentication System**
  - Secure login/logout with JWT tokens
  - Token refresh mechanism
  - Protected routes with auth guards
  - User profile management

- **Dashboard Layout**
  - Responsive sidebar navigation
  - Professional header with user menu
  - Breadcrumb navigation
  - Mobile-friendly design

- **Post Management**
  - Advanced data table with filtering and sorting
  - Create, edit, delete posts
  - Rich Markdown editor with live preview
  - Image upload with drag & drop
  - SEO metadata management
  - Draft auto-save
  - Batch operations
  - Publishing workflow

- **Tag Management**
  - CRUD operations for tags
  - Color-coded tags
  - Tag usage statistics
  - Searchable tag selector

- **Comment Management**
  - Comment moderation interface
  - Batch approve/reject/spam
  - Reply to comments
  - Statistics dashboard
  - Advanced filtering

- **User Interface**
  - Clean, modern design with Ant Design
  - Fully responsive layout
  - Loading states and error handling
  - Toast notifications
  - Optimistic updates

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Ant Design 5
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod
- **Markdown Editor**: @uiw/react-md-editor
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Styling**: Tailwind CSS + Ant Design Theme

## 📁 Project Structure

```
heimdall-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login)
│   │   ├── (dashboard)/       # Admin dashboard pages
│   │   └── api/               # API routes (if needed)
│   ├── components/            # Reusable components
│   │   ├── common/           # Common UI components
│   │   ├── editor/           # Markdown editor components
│   │   ├── features/         # Feature-specific components
│   │   └── layout/           # Layout components
│   ├── services/             # API services and hooks
│   │   ├── api/             # API client and services
│   │   └── hooks/           # React Query hooks
│   ├── lib/                 # Utilities and helpers
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles and theme
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/heimdall-web.git
cd heimdall-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/admin
NEXT_PUBLIC_APP_NAME=Heimdall Admin
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## 🧪 Testing

Currently, the project focuses on type safety with TypeScript. Unit and integration tests can be added using:

- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

## 📝 API Integration

The application expects a backend API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Get user profile

### Posts
- `GET /posts` - List posts with pagination
- `GET /posts/:id` - Get single post
- `POST /posts` - Create post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/publish` - Publish post
- `POST /posts/:id/unpublish` - Unpublish post

### Tags
- `GET /tags` - List tags
- `POST /tags` - Create tag
- `PUT /tags/:id` - Update tag
- `DELETE /tags/:id` - Delete tag

### Comments
- `GET /comments` - List comments
- `PATCH /comments/:id/status` - Update comment status
- `DELETE /comments/:id` - Delete comment
- `POST /comments/:id/reply` - Reply to comment

## 🎨 Customization

### Theme

Modify the Ant Design theme in `src/styles/antd-theme.ts`:

```typescript
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    // Add your customizations
  },
};
```

### Tailwind CSS

Update `tailwind.config.ts` for custom styling needs.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy

### Docker

A Dockerfile can be added for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

- All API calls use HTTPS in production
- JWT tokens stored in localStorage with refresh mechanism
- Input validation with Zod schemas
- XSS protection in Markdown rendering
- CSRF protection via API tokens

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Ant Design for the comprehensive UI components
- TanStack for React Query
- All other open source contributors