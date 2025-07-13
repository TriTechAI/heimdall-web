import { test, expect } from '@playwright/test';

test.describe('Debug Check', () => {
  test('check what page loads', async ({ page }) => {
    // Enable detailed logging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));
    
    console.log('Navigating to /login...');
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    // Take screenshot
    await page.screenshot({ path: 'debug-login-page.png' });
    
    // Get page URL
    console.log('Current URL:', page.url());
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Try to get page content
    const bodyText = await page.locator('body').textContent();
    console.log('Page content preview:', bodyText?.substring(0, 200));
    
    // Check for common error indicators
    const hasError = await page.locator('text=error').count();
    if (hasError > 0) {
      console.log('Found error text on page');
    }
    
    // Check for 404 or error pages
    const has404 = await page.locator('text=404').count();
    if (has404 > 0) {
      console.log('Found 404 on page');
    }
  });
});