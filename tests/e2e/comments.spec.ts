import { test, expect, testData } from '../fixtures/test-fixtures';
import { CommentHelper } from '../helpers/comment.helper';

test.describe('Comment Management', () => {
  let commentHelper: CommentHelper;

  test.use({ storageState: { cookies: [], origins: [] } }); // Use authenticated state

  test.beforeEach(async ({ authenticatedPage }) => {
    commentHelper = new CommentHelper(authenticatedPage);
    await authenticatedPage.goto('/');
  });

  test('should display comments list page', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();

    // Check page elements
    await expect(authenticatedPage.locator('h1:has-text("Comments")')).toBeVisible();
    await expect(authenticatedPage.locator('.ant-tabs')).toBeVisible();
    await expect(authenticatedPage.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should filter comments by status', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();

    // Test different status filters
    const statuses = ['all', 'pending', 'approved', 'rejected', 'spam'] as const;
    
    for (const status of statuses) {
      await commentHelper.filterByStatus(status);
      
      // Verify tab is active
      const activeTab = authenticatedPage.locator('.ant-tabs-tab-active');
      await expect(activeTab).toContainText(status.charAt(0).toUpperCase() + status.slice(1));
    }
  });

  test('should approve a pending comment', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Filter to show pending comments
    await commentHelper.filterByStatus('pending');

    // Mock data - in real test, you'd create a comment first
    const commentContent = 'This is a pending comment';
    
    // Approve the comment
    await commentHelper.approveComment(commentContent);

    // Switch to approved tab
    await commentHelper.filterByStatus('approved');

    // Verify comment is in approved list
    await commentHelper.verifyCommentExists(commentContent);
  });

  test('should reject a comment', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Filter to show pending comments
    await commentHelper.filterByStatus('pending');

    const commentContent = 'This comment will be rejected';
    
    // Reject the comment
    await commentHelper.rejectComment(commentContent);

    // Switch to rejected tab
    await commentHelper.filterByStatus('rejected');

    // Verify comment is in rejected list
    await commentHelper.verifyCommentExists(commentContent);
  });

  test('should mark comment as spam', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Filter to show pending comments
    await commentHelper.filterByStatus('pending');

    const commentContent = 'This is spam content';
    
    // Mark as spam
    await commentHelper.markAsSpam(commentContent);

    // Switch to spam tab
    await commentHelper.filterByStatus('spam');

    // Verify comment is in spam list
    await commentHelper.verifyCommentExists(commentContent);
  });

  test('should delete a comment', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    const commentContent = 'Comment to be deleted';
    
    // Delete the comment
    await commentHelper.deleteComment(commentContent);

    // Verify comment is deleted
    await commentHelper.verifyCommentNotExists(commentContent);
  });

  test('should reply to a comment', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    const commentContent = 'Original comment';
    const replyText = 'Thank you for your comment!';
    
    // Reply to comment
    await commentHelper.replyToComment(commentContent, replyText);

    // Verify reply was added (in real app, you'd check the comment thread)
    await expect(authenticatedPage.locator('.ant-message-success')).toBeVisible();
  });

  test('should batch approve multiple comments', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Filter to show pending comments
    await commentHelper.filterByStatus('pending');

    const commentsToApprove = [
      'Pending comment 1',
      'Pending comment 2',
      'Pending comment 3'
    ];

    // Batch approve
    await commentHelper.batchApprove(commentsToApprove.slice(0, 2));

    // Switch to approved tab
    await commentHelper.filterByStatus('approved');

    // Verify comments are approved
    await commentHelper.verifyCommentExists(commentsToApprove[0]);
    await commentHelper.verifyCommentExists(commentsToApprove[1]);
  });

  test('should search comments', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Search for specific comment
    await commentHelper.searchComments('specific keyword');

    // Wait for search results
    await authenticatedPage.waitForTimeout(500);

    // In real test, verify search results
    // For now, just check that search was performed
    const searchInput = authenticatedPage.locator('input[placeholder*="Search"]');
    await expect(searchInput).toHaveValue('specific keyword');
  });

  test('should display comment statistics', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();

    // Check for statistics display
    await expect(authenticatedPage.locator('text=Total Comments')).toBeVisible();
    await expect(authenticatedPage.locator('text=Pending')).toBeVisible();
    await expect(authenticatedPage.locator('text=Approved')).toBeVisible();
    await expect(authenticatedPage.locator('text=Spam')).toBeVisible();
  });

  test('should show comment details in modal', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    const commentContent = 'Comment with details';
    
    // Click on comment to view details
    const commentRow = authenticatedPage.locator(`tr:has-text("${commentContent}")`);
    await commentRow.locator('button:has-text("View")').click();

    // Verify modal shows comment details
    await expect(authenticatedPage.locator('.ant-modal')).toBeVisible();
    await expect(authenticatedPage.locator('.ant-modal-body')).toContainText(commentContent);
    
    // Close modal
    await authenticatedPage.keyboard.press('Escape');
  });

  test('should handle comment moderation workflow', async ({ authenticatedPage }) => {
    await commentHelper.navigateToComments();
    
    // Start with pending comments
    await commentHelper.filterByStatus('pending');

    const testComment = 'Workflow test comment';

    // First approve
    await commentHelper.approveComment(testComment);

    // Then go to approved and reject it
    await commentHelper.filterByStatus('approved');
    const commentRow = authenticatedPage.locator(`tr:has-text("${testComment}")`);
    await commentRow.locator('button:has-text("Reject")').click();

    // Verify it's in rejected
    await commentHelper.filterByStatus('rejected');
    await commentHelper.verifyCommentExists(testComment);
  });
});