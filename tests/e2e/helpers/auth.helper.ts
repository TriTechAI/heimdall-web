import { Page, expect } from '@playwright/test';

export class AuthHelper {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto('/login');
    
    // Fill login form
    await this.page.fill('input[id="username"]', username);
    await this.page.fill('input[id="password"]', password);
    
    // Submit form
    await this.page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await this.page.waitForURL('/', { timeout: 10000 });
    
    // Verify we're logged in
    await expect(this.page.locator('text=Dashboard')).toBeVisible();
  }

  async logout() {
    // Click user dropdown
    await this.page.click('[data-testid="user-dropdown"]');
    
    // Click logout
    await this.page.click('text=Logout');
    
    // Wait for redirect to login
    await this.page.waitForURL('/login');
  }

  async verifyLoggedIn() {
    // Check if dashboard is visible
    await expect(this.page.locator('text=Dashboard')).toBeVisible();
    
    // Check if user menu is visible
    await expect(this.page.locator('[data-testid="user-dropdown"]')).toBeVisible();
  }

  async verifyLoggedOut() {
    // Should be on login page
    await expect(this.page).toHaveURL('/login');
    
    // Login form should be visible
    await expect(this.page.locator('input[id="username"]')).toBeVisible();
  }
}