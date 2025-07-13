import { test, expect } from '@playwright/test';

test.describe('Heimdall Admin - Basic Functionality', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check if login page loads
    await expect(page).toHaveURL(/.*login/);
    
    // Check page title
    await expect(page.locator('text=Heimdall Admin')).toBeVisible();
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    
    // Check for login form elements using Ant Design selectors
    const usernameInput = page.locator('input[placeholder="Username"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const submitButton = page.locator('button:has-text("Sign in")');
    
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    console.log('✅ Login page loaded successfully');
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Click submit without filling form
    await page.click('button:has-text("Sign in")');
    
    // Check for validation messages
    await expect(page.locator('text=Please input your username!')).toBeVisible();
    await expect(page.locator('text=Please input your password!')).toBeVisible();
    
    console.log('✅ Form validation works correctly');
  });

  test('should handle login with mock credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in the form
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'Admin123!');
    
    // Check remember me
    await page.click('text=Remember me');
    
    // Note: In a real test, we would mock the API response
    // For now, just verify the form can be filled
    
    // Verify inputs have values
    await expect(page.locator('input[placeholder="Username"]')).toHaveValue('admin');
    await expect(page.locator('input[placeholder="Password"]')).toHaveValue('Admin123!');
    
    console.log('✅ Login form can be filled correctly');
  });

  test('should have proper styling and layout', async ({ page }) => {
    await page.goto('/login');
    
    // Check for Card component
    await expect(page.locator('.ant-card')).toBeVisible();
    
    // Check form exists
    await expect(page.locator('form[name="login"]')).toBeVisible();
    
    // Check for icons
    await expect(page.locator('.anticon-user')).toBeVisible();
    await expect(page.locator('.anticon-lock')).toBeVisible();
    
    console.log('✅ Login page has proper styling');
  });
});