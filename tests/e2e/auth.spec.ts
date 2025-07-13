import { test, expect, testData } from '../fixtures/test-fixtures';
import { AuthHelper } from '../helpers/auth.helper';

test.describe('Authentication', () => {
  let authHelper: AuthHelper;

  test.beforeEach(async ({ page }) => {
    authHelper = new AuthHelper(page);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    // Check page title
    await expect(page).toHaveTitle(/Heimdall Admin/);

    // Check login form elements
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
    await expect(page.locator('input[id="username"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Try to login with invalid credentials
    await page.fill('input[id="username"]', 'invalid');
    await page.fill('input[id="password"]', 'invalid');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.ant-message-error')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await authHelper.login(testData.admin.username, testData.admin.password);

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    
    // Should show dashboard content
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    
    // Should show user menu
    await expect(page.locator('[data-testid="user-dropdown"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await authHelper.login(testData.admin.username, testData.admin.password);
    await authHelper.verifyLoggedIn();

    // Then logout
    await authHelper.logout();
    await authHelper.verifyLoggedOut();
  });

  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should remember login with remember me checkbox', async ({ page }) => {
    await page.goto('/login');

    // Fill form with remember me checked
    await page.fill('input[id="username"]', testData.admin.username);
    await page.fill('input[id="password"]', testData.admin.password);
    await page.check('input[type="checkbox"]'); // Remember me checkbox
    await page.click('button[type="submit"]');

    // Should login successfully
    await expect(page).toHaveURL('/');

    // Check if remember me token is set (in a real app, this would check cookies/localStorage)
    const localStorage = await page.evaluate(() => window.localStorage);
    expect(localStorage).toHaveProperty('rememberMe');
  });

  test('should handle session expiry gracefully', async ({ page, context }) => {
    // Login first
    await authHelper.login(testData.admin.username, testData.admin.password);

    // Clear auth token to simulate expiry
    await context.clearCookies();
    await page.evaluate(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('refreshToken');
    });

    // Try to navigate to a protected route
    await page.goto('/posts');

    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});