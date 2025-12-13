import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display navigation on homepage', async ({ page }) => {
    await page.goto('/');

    // Check that navigation exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('should have navigation links to main sections', async ({ page }) => {
    await page.goto('/');

    // Look for common navigation patterns
    const navLinks = page.locator('nav a, header a');

    // Should have multiple navigation links
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to groups page from navigation', async ({ page }) => {
    await page.goto('/');

    // Find and click a link to groups
    await page.click('a[href*="groups"]');

    // Should navigate to groups page
    await expect(page).toHaveURL(/\/groups/);
  });
});

test.describe('Footer', () => {
  test('should display footer on all pages', async ({ page }) => {
    const pages = ['/', '/groups', '/community'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check that footer exists
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();
    }
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still load and display content
    await expect(page.locator('body')).toBeVisible();

    // Main content should be visible
    const mainContent = page.locator('main, article, .container').first();
    await expect(mainContent).toBeVisible();
  });

  test('should be tablet responsive', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/groups');

    // Group cards should be visible
    const groupCards = page.locator('article');
    await expect(groupCards.first()).toBeVisible();
  });
});
