import { Page, expect } from '@playwright/test';

export class TagHelper {
  constructor(private page: Page) {}

  async navigateToTags() {
    await this.page.click('a[href="/tags"]');
    await this.page.waitForURL('/tags');
    await expect(this.page.locator('h1:has-text("Tags")')).toBeVisible();
  }

  async createTag(data: {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
  }) {
    // Click new tag button
    await this.page.click('button:has-text("New Tag")');

    // Wait for modal
    await expect(this.page.locator('.ant-modal')).toBeVisible();

    // Fill tag form
    await this.page.fill('input[name="name"]', data.name);
    
    if (data.slug) {
      await this.page.fill('input[name="slug"]', data.slug);
    }

    if (data.description) {
      await this.page.fill('textarea[name="description"]', data.description);
    }

    if (data.color) {
      // Click color picker
      await this.page.click('.ant-color-picker-trigger');
      // For simplicity, just close it (it will use default or current color)
      await this.page.keyboard.press('Escape');
    }

    // Submit form
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async editTag(tagName: string, updates: Partial<{
    name: string;
    description: string;
  }>) {
    // Find and click edit button for the tag
    const tagRow = this.page.locator(`tr:has-text("${tagName}")`);
    await tagRow.locator('button:has-text("Edit")').click();

    // Wait for modal
    await expect(this.page.locator('.ant-modal')).toBeVisible();

    // Update fields
    if (updates.name) {
      await this.page.fill('input[name="name"]', updates.name);
    }

    if (updates.description) {
      await this.page.fill('textarea[name="description"]', updates.description);
    }

    // Submit form
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async deleteTag(tagName: string) {
    const tagRow = this.page.locator(`tr:has-text("${tagName}")`);
    await tagRow.locator('button:has-text("Delete")').click();

    // Confirm deletion
    await this.page.click('.ant-popconfirm button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();

    // Verify tag is gone
    await expect(tagRow).not.toBeVisible();
  }

  async searchTags(keyword: string) {
    await this.page.fill('input[placeholder*="Search"]', keyword);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results
    await this.page.waitForTimeout(500);
  }

  async verifyTagExists(tagName: string) {
    await expect(this.page.locator(`tr:has-text("${tagName}")`)).toBeVisible();
  }

  async verifyTagNotExists(tagName: string) {
    await expect(this.page.locator(`tr:has-text("${tagName}")`)).not.toBeVisible();
  }

  async verifyTagCount(count: number) {
    const rows = await this.page.locator('tbody tr').count();
    expect(rows).toBe(count);
  }
}