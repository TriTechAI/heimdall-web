import { Page, expect } from '@playwright/test';

export class PostHelper {
  constructor(private page: Page) {}

  async navigateToPosts() {
    await this.page.click('a[href="/posts"]');
    await this.page.waitForURL('/posts');
    await expect(this.page.locator('h1:has-text("Posts")')).toBeVisible();
  }

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    status?: 'draft' | 'published';
  }) {
    // Click new post button
    await this.page.click('button:has-text("New Post")');
    await this.page.waitForURL('/posts/new');

    // Fill post form
    await this.page.fill('input[name="title"]', data.title);
    
    // Fill content in markdown editor
    const editorTextarea = await this.page.locator('.w-md-editor-text-area').first();
    await editorTextarea.fill(data.content);

    // Fill excerpt if provided
    if (data.excerpt) {
      await this.page.fill('textarea[name="excerpt"]', data.excerpt);
    }

    // Add tags if provided
    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.page.click('.ant-select-selector');
        await this.page.fill('.ant-select-search input', tag);
        await this.page.keyboard.press('Enter');
      }
    }

    // Save post
    if (data.status === 'published') {
      await this.page.click('button:has-text("Publish")');
    } else {
      await this.page.click('button:has-text("Save Draft")');
    }

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async editPost(postTitle: string, updates: Partial<{
    title: string;
    content: string;
    excerpt: string;
  }>) {
    // Find and click edit button for the post
    const postRow = this.page.locator(`tr:has-text("${postTitle}")`);
    await postRow.locator('button:has-text("Edit")').click();

    // Wait for edit page
    await this.page.waitForURL(/\/posts\/\w+\/edit/);

    // Update fields
    if (updates.title) {
      await this.page.fill('input[name="title"]', updates.title);
    }

    if (updates.content) {
      const editorTextarea = await this.page.locator('.w-md-editor-text-area').first();
      await editorTextarea.fill(updates.content);
    }

    if (updates.excerpt) {
      await this.page.fill('textarea[name="excerpt"]', updates.excerpt);
    }

    // Save changes
    await this.page.click('button:has-text("Save")');
    
    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async deletePost(postTitle: string) {
    const postRow = this.page.locator(`tr:has-text("${postTitle}")`);
    await postRow.locator('button:has-text("Delete")').click();

    // Confirm deletion
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();

    // Verify post is gone
    await expect(postRow).not.toBeVisible();
  }

  async publishPost(postTitle: string) {
    const postRow = this.page.locator(`tr:has-text("${postTitle}")`);
    await postRow.locator('button:has-text("Publish")').click();

    // Confirm publish
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async searchPosts(keyword: string) {
    await this.page.fill('input[placeholder*="Search"]', keyword);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results
    await this.page.waitForTimeout(500);
  }

  async verifyPostExists(postTitle: string) {
    await expect(this.page.locator(`tr:has-text("${postTitle}")`)).toBeVisible();
  }

  async verifyPostNotExists(postTitle: string) {
    await expect(this.page.locator(`tr:has-text("${postTitle}")`)).not.toBeVisible();
  }

  async verifyPostCount(count: number) {
    const rows = await this.page.locator('tbody tr').count();
    expect(rows).toBe(count);
  }
}