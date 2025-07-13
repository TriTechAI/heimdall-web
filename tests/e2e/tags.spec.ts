import { test, expect, testData } from '../fixtures/test-fixtures';
import { TagHelper } from '../helpers/tag.helper';

test.describe('Tag Management', () => {
  let tagHelper: TagHelper;

  test.use({ storageState: { cookies: [], origins: [] } }); // Use authenticated state

  test.beforeEach(async ({ authenticatedPage }) => {
    tagHelper = new TagHelper(authenticatedPage);
    await authenticatedPage.goto('/');
  });

  test('should display tags list page', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();

    // Check page elements
    await expect(authenticatedPage.locator('h1:has-text("Tags")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Tag")')).toBeVisible();
    await expect(authenticatedPage.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new tag', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Create tag
    await tagHelper.createTag({
      name: 'Test Tag',
      slug: 'test-tag',
      description: 'This is a test tag',
      color: '#1890ff'
    });

    // Verify tag exists
    await tagHelper.verifyTagExists('Test Tag');
  });

  test('should edit an existing tag', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // First create a tag
    await tagHelper.createTag({
      name: 'Tag to Edit',
      description: 'Original description'
    });

    // Edit the tag
    await tagHelper.editTag('Tag to Edit', {
      name: 'Edited Tag Name',
      description: 'Updated description'
    });

    // Verify updated tag exists
    await tagHelper.verifyTagExists('Edited Tag Name');
    await tagHelper.verifyTagNotExists('Tag to Edit');
  });

  test('should delete a tag', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // First create a tag
    await tagHelper.createTag({
      name: 'Tag to Delete',
      description: 'This tag will be deleted'
    });

    // Delete the tag
    await tagHelper.deleteTag('Tag to Delete');

    // Verify tag is deleted
    await tagHelper.verifyTagNotExists('Tag to Delete');
  });

  test('should search tags', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Create multiple tags
    await tagHelper.createTag({
      name: 'JavaScript',
      description: 'JavaScript related posts'
    });

    await tagHelper.createTag({
      name: 'TypeScript',
      description: 'TypeScript related posts'
    });

    await tagHelper.createTag({
      name: 'Python',
      description: 'Python related posts'
    });

    // Search for specific tag
    await tagHelper.searchTags('Script');

    // Verify search results
    await tagHelper.verifyTagExists('JavaScript');
    await tagHelper.verifyTagExists('TypeScript');
    await tagHelper.verifyTagNotExists('Python');
  });

  test('should validate tag uniqueness', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Create first tag
    await tagHelper.createTag({
      name: 'Unique Tag',
      slug: 'unique-tag'
    });

    // Try to create duplicate tag
    await authenticatedPage.click('button:has-text("New Tag")');
    await authenticatedPage.fill('input[name="name"]', 'Unique Tag');
    await authenticatedPage.fill('input[name="slug"]', 'unique-tag');
    await authenticatedPage.click('.ant-modal-footer button:has-text("OK")');

    // Should show error message
    await expect(authenticatedPage.locator('.ant-message-error')).toBeVisible();
  });

  test('should handle batch delete', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Create multiple tags
    const tagsToCreate = ['Batch Tag 1', 'Batch Tag 2', 'Batch Tag 3'];
    
    for (const tagName of tagsToCreate) {
      await tagHelper.createTag({ name: tagName });
    }

    // Select tags for batch operation
    for (const tagName of tagsToCreate.slice(0, 2)) {
      const checkbox = authenticatedPage.locator(`tr:has-text("${tagName}") input[type="checkbox"]`);
      await checkbox.check();
    }

    // Perform batch delete
    await authenticatedPage.click('button:has-text("Batch Delete")');
    await authenticatedPage.click('.ant-modal-footer button:has-text("OK")');

    // Wait for success message
    await expect(authenticatedPage.locator('.ant-message-success')).toBeVisible();

    // Verify tags are deleted
    await tagHelper.verifyTagNotExists('Batch Tag 1');
    await tagHelper.verifyTagNotExists('Batch Tag 2');
    await tagHelper.verifyTagExists('Batch Tag 3');
  });

  test('should display tag post count', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Create a tag
    await tagHelper.createTag({
      name: 'Popular Tag',
      description: 'A popular tag'
    });

    // The tag row should display post count
    const tagRow = authenticatedPage.locator(`tr:has-text("Popular Tag")`);
    await expect(tagRow.locator('td:has-text("0")')).toBeVisible(); // Initially 0 posts
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Click new tag button
    await authenticatedPage.click('button:has-text("New Tag")');

    // Try to save without filling required fields
    await authenticatedPage.click('.ant-modal-footer button:has-text("OK")');

    // Should show validation error
    await expect(authenticatedPage.locator('text=Tag name is required')).toBeVisible();
  });

  test('should auto-generate slug from name', async ({ authenticatedPage }) => {
    await tagHelper.navigateToTags();
    
    // Click new tag button
    await authenticatedPage.click('button:has-text("New Tag")');

    // Fill name field
    await authenticatedPage.fill('input[name="name"]', 'Auto Generated Slug');

    // Check if slug is auto-generated
    const slugInput = authenticatedPage.locator('input[name="slug"]');
    await expect(slugInput).toHaveValue('auto-generated-slug');
  });
});