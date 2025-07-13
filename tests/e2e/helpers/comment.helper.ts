import { Page, expect } from '@playwright/test';

export class CommentHelper {
  constructor(private page: Page) {}

  async navigateToComments() {
    await this.page.click('a[href="/comments"]');
    await this.page.waitForURL('/comments');
    await expect(this.page.locator('h1:has-text("Comments")')).toBeVisible();
  }

  async approveComment(commentContent: string) {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("Approve")').click();

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async rejectComment(commentContent: string) {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("Reject")').click();

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async markAsSpam(commentContent: string) {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("Spam")').click();

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async deleteComment(commentContent: string) {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("Delete")').click();

    // Confirm deletion
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();

    // Verify comment is gone
    await expect(commentRow).not.toBeVisible();
  }

  async replyToComment(commentContent: string, replyText: string) {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("Reply")').click();

    // Wait for reply modal
    await expect(this.page.locator('.ant-modal')).toBeVisible();

    // Type reply
    await this.page.fill('textarea[name="reply"]', replyText);

    // Submit reply
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async filterByStatus(status: 'all' | 'pending' | 'approved' | 'rejected' | 'spam') {
    await this.page.click('.ant-tabs-tab:has-text("' + status.charAt(0).toUpperCase() + status.slice(1) + '")');
    
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  async batchApprove(commentContents: string[]) {
    // Select comments
    for (const content of commentContents) {
      const checkbox = this.page.locator(`tr:has-text("${content}") input[type="checkbox"]`);
      await checkbox.check();
    }

    // Click batch approve
    await this.page.click('button:has-text("Batch Approve")');

    // Confirm action
    await this.page.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(this.page.locator('.ant-message-success')).toBeVisible();
  }

  async searchComments(keyword: string) {
    await this.page.fill('input[placeholder*="Search"]', keyword);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results
    await this.page.waitForTimeout(500);
  }

  async verifyCommentExists(commentContent: string) {
    await expect(this.page.locator(`tr:has-text("${commentContent}")`)).toBeVisible();
  }

  async verifyCommentNotExists(commentContent: string) {
    await expect(this.page.locator(`tr:has-text("${commentContent}")`)).not.toBeVisible();
  }

  async verifyCommentStatus(commentContent: string, status: 'pending' | 'approved' | 'rejected' | 'spam') {
    const commentRow = this.page.locator(`tr:has-text("${commentContent}")`);
    await expect(commentRow.locator(`.ant-badge:has-text("${status}")`)).toBeVisible();
  }
}