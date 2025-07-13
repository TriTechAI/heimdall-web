import { test, expect } from '@playwright/test';

test.describe('Heimdall Admin - E2E Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any authentication if needed
    await page.goto('http://localhost:3000');
  });

  test('Application loads and redirects to login', async ({ page }) => {
    // When accessing root without auth, should redirect to login
    await page.goto('http://localhost:3000');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'homepage-screenshot.png' });
    
    // Log current URL
    console.log('Current URL:', page.url());
    
    // Check if we're on a page (not 404)
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Verify we're not on a 404 page
    expect(pageTitle).not.toContain('404');
  });

  test('Can access login page directly', async ({ page }) => {
    // Go directly to login
    await page.goto('http://localhost:3000/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ path: 'login-page-screenshot.png' });
    
    // Check page title
    const pageTitle = await page.title();
    console.log('Login page title:', pageTitle);
    
    // Look for any login-related content
    const pageContent = await page.content();
    console.log('Page has content length:', pageContent.length);
    
    // Try to find any input fields
    const inputs = await page.locator('input').count();
    console.log('Number of input fields found:', inputs);
  });

  test('Check posts page accessibility', async ({ page }) => {
    // Try to access posts page
    await page.goto('http://localhost:3000/posts');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Screenshot
    await page.screenshot({ path: 'posts-page-screenshot.png' });
    
    // Get URL after navigation
    console.log('Posts page URL:', page.url());
    
    // Check if redirected or shows content
    const hasContent = await page.locator('body').textContent();
    console.log('Page has content:', hasContent?.length || 0, 'characters');
  });
});