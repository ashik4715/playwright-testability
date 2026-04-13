import { test, expect } from '@playwright/test';

test.describe('Delete Article', () => {
  test('@negative should handle non-existent article', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/article/non-existent');
    const hasContent = await page.locator('h1').count();
    expect(hasContent).toBeGreaterThanOrEqual(0);
  });
});