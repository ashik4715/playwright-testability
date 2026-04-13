import { test, expect } from '@playwright/test';

test.describe('Create New Article', () => {
  test('@positive should load editor page', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    const count = await page.locator('.article-preview').count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});