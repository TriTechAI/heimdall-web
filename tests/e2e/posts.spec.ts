import { test, expect, testData } from '../fixtures/test-fixtures';
import { PostHelper } from '../helpers/post.helper';

test.describe('Post Management', () => {
  let postHelper: PostHelper;

  test.use({ storageState: { cookies: [], origins: [] } }); // Use authenticated state

  test.beforeEach(async ({ authenticatedPage }) => {
    postHelper = new PostHelper(authenticatedPage);
    await authenticatedPage.goto('/');
  });

  test('should display posts list page', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();

    // Check page elements
    await expect(authenticatedPage.locator('h1:has-text("Posts")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Post")')).toBeVisible();
    await expect(authenticatedPage.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new draft post', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create draft post
    await postHelper.createPost({
      ...testData.posts.draft,
      status: 'draft'
    });

    // Go back to posts list
    await postHelper.navigateToPosts();

    // Verify post exists
    await postHelper.verifyPostExists(testData.posts.draft.title);
  });

  test('should create and publish a post', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create and publish post
    await postHelper.createPost({
      ...testData.posts.published,
      status: 'published'
    });

    // Go back to posts list
    await postHelper.navigateToPosts();

    // Verify post exists and is published
    await postHelper.verifyPostExists(testData.posts.published.title);
    
    // Check for published status badge
    const postRow = authenticatedPage.locator(`tr:has-text("${testData.posts.published.title}")`);
    await expect(postRow.locator('.ant-badge:has-text("Published")')).toBeVisible();
  });

  test('should edit an existing post', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // First create a post
    await postHelper.createPost({
      title: 'Post to Edit',
      content: 'Original content',
      status: 'draft'
    });

    await postHelper.navigateToPosts();

    // Edit the post
    await postHelper.editPost('Post to Edit', {
      title: 'Edited Post Title',
      content: 'Updated content with more details'
    });

    // Go back to posts list
    await postHelper.navigateToPosts();

    // Verify updated post exists
    await postHelper.verifyPostExists('Edited Post Title');
    await postHelper.verifyPostNotExists('Post to Edit');
  });

  test('should delete a post', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // First create a post
    await postHelper.createPost({
      title: 'Post to Delete',
      content: 'This post will be deleted',
      status: 'draft'
    });

    await postHelper.navigateToPosts();

    // Delete the post
    await postHelper.deletePost('Post to Delete');

    // Verify post is deleted
    await postHelper.verifyPostNotExists('Post to Delete');
  });

  test('should publish a draft post', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create a draft post
    await postHelper.createPost({
      title: 'Draft to Publish',
      content: 'This draft will be published',
      status: 'draft'
    });

    await postHelper.navigateToPosts();

    // Publish the post
    await postHelper.publishPost('Draft to Publish');

    // Verify post is published
    const postRow = authenticatedPage.locator(`tr:has-text("Draft to Publish")`);
    await expect(postRow.locator('.ant-badge:has-text("Published")')).toBeVisible();
  });

  test('should search posts', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create multiple posts
    await postHelper.createPost({
      title: 'Search Test Post 1',
      content: 'Content with keyword: testing',
      status: 'draft'
    });

    await postHelper.navigateToPosts();
    
    await postHelper.createPost({
      title: 'Another Post',
      content: 'Different content',
      status: 'draft'
    });

    await postHelper.navigateToPosts();

    // Search for specific post
    await postHelper.searchPosts('Search Test');

    // Verify search results
    await postHelper.verifyPostExists('Search Test Post 1');
    await postHelper.verifyPostNotExists('Another Post');
  });

  test('should handle batch operations', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create multiple posts
    const postsToCreate = [
      { title: 'Batch Post 1', content: 'Content 1', status: 'draft' as const },
      { title: 'Batch Post 2', content: 'Content 2', status: 'draft' as const },
      { title: 'Batch Post 3', content: 'Content 3', status: 'draft' as const }
    ];

    for (const post of postsToCreate) {
      await postHelper.createPost(post);
      await postHelper.navigateToPosts();
    }

    // Select posts for batch operation
    for (const post of postsToCreate.slice(0, 2)) {
      const checkbox = authenticatedPage.locator(`tr:has-text("${post.title}") input[type="checkbox"]`);
      await checkbox.check();
    }

    // Perform batch delete
    await authenticatedPage.click('button:has-text("Batch Delete")');
    await authenticatedPage.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(authenticatedPage.locator('.ant-message-success')).toBeVisible();

    // Verify posts are deleted
    await postHelper.verifyPostNotExists('Batch Post 1');
    await postHelper.verifyPostNotExists('Batch Post 2');
    await postHelper.verifyPostExists('Batch Post 3');
  });

  test('should preview post before publishing', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Create a post with markdown content
    await postHelper.createPost({
      title: 'Preview Test Post',
      content: '# Heading 1\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2',
      excerpt: 'This is a preview test',
      status: 'draft'
    });

    await postHelper.navigateToPosts();

    // Click preview button
    const postRow = authenticatedPage.locator(`tr:has-text("Preview Test Post")`);
    await postRow.locator('button:has-text("Preview")').click();

    // Wait for preview page
    await authenticatedPage.waitForURL(/\/posts\/\w+\/preview/);

    // Verify preview content
    await expect(authenticatedPage.locator('h1:has-text("Heading 1")')).toBeVisible();
    await expect(authenticatedPage.locator('strong:has-text("Bold text")')).toBeVisible();
    await expect(authenticatedPage.locator('em:has-text("italic text")')).toBeVisible();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await postHelper.navigateToPosts();
    
    // Click new post button
    await authenticatedPage.click('button:has-text("New Post")');
    await authenticatedPage.waitForURL('/posts/new');

    // Try to save without filling required fields
    await authenticatedPage.click('button:has-text("Save Draft")');

    // Should show validation errors
    await expect(authenticatedPage.locator('text=Title is required')).toBeVisible();
    await expect(authenticatedPage.locator('text=Content is required')).toBeVisible();
  });
});