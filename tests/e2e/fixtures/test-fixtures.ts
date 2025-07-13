import { test as base, Page } from '@playwright/test';

// Define test fixtures
export interface TestFixtures {
  authenticatedPage: Page;
}

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    // Set up authentication token
    const testToken = process.env.TEST_AUTH_TOKEN || 'test-jwt-token';
    const testRefreshToken = process.env.TEST_REFRESH_TOKEN || 'test-refresh-token';
    
    // Set localStorage before navigating
    await context.addInitScript(() => {
      window.localStorage.setItem('token', 'test-jwt-token');
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      window.localStorage.setItem('user', JSON.stringify({
        id: '1',
        username: 'admin',
        nickname: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        avatar: '',
        status: 'active'
      }));
    });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';

// Common test data
export const testData = {
  admin: {
    username: 'admin',
    password: 'Admin123!',
    email: 'admin@example.com'
  },
  posts: {
    draft: {
      title: 'Test Draft Post',
      content: '# Test Draft Post\n\nThis is a test draft post content.',
      excerpt: 'This is a test draft post excerpt.',
      tags: ['test', 'draft']
    },
    published: {
      title: 'Test Published Post',
      content: '# Test Published Post\n\nThis is a test published post content.',
      excerpt: 'This is a test published post excerpt.',
      tags: ['test', 'published']
    }
  },
  tags: {
    test: {
      name: 'test',
      slug: 'test',
      description: 'Test tag description',
      color: '#1890ff'
    }
  },
  comments: {
    approved: {
      content: 'This is an approved comment',
      author: 'Test User',
      email: 'test@example.com'
    },
    pending: {
      content: 'This is a pending comment',
      author: 'Pending User',
      email: 'pending@example.com'
    }
  }
};