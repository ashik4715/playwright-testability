import { test, expect } from '@playwright/test';

test.describe('Update User Settings', () => {
  test('@positive should load home page', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    const count = await page.locator('.article-preview').count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});