import { test, expect } from '@playwright/test';

test.describe('Route Check', () => {
  test('check root route', async ({ page }) => {
    console.log('Testing root route /');
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    
    console.log('Response status:', response?.status());
    console.log('Current URL after navigation:', page.url());
    
    await page.screenshot({ path: 'debug-root-page.png' });
    
    const title = await page.title();
    console.log('Page title:', title);
  });

  test('check posts route', async ({ page }) => {
    console.log('Testing /posts route');
    const response = await page.goto('/posts', { waitUntil: 'networkidle' });
    
    console.log('Response status:', response?.status());
    console.log('Current URL after navigation:', page.url());
    
    await page.screenshot({ path: 'debug-posts-page.png' });
  });

  test('direct login route check', async ({ page }) => {
    console.log('Testing direct navigation to login');
    
    // Try different login URL patterns
    const urls = ['/login', '/auth/login', '/(auth)/login'];
    
    for (const url of urls) {
      console.log(`Trying ${url}`);
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      console.log(`${url} - Status: ${response?.status()}, Final URL: ${page.url()}`);
      
      if (response?.status() === 200) {
        console.log(`Success! Login page found at ${url}`);
        break;
      }
    }
  });
});