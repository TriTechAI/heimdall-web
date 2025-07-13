import { test, expect } from '@playwright/test';

test.describe('Basic Functionality Check', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login page loads
    await expect(page).toHaveURL(/.*login/);
    
    // Check for login form elements
    const usernameInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');
    const submitButton = page.locator('button[type="submit"]');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log('✅ Login page loaded successfully');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    
    console.log('✅ Protected routes redirect to login');
  });

  test('should show login form validation', async ({ page }) => {
    await page.goto('/login');
    
    // Click submit without filling form
    await page.click('button[type="submit"]');
    
    // Wait a bit for validation
    await page.waitForTimeout(1000);
    
    // Check if we're still on login page (validation prevented submission)
    await expect(page).toHaveURL(/.*login/);
    
    console.log('✅ Form validation works');
  });
});