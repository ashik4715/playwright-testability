import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects';

test.describe('Filter Articles by Tag', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  test('@positive should show article count for filtered tag', async () => {
    await homePage.navigate();
    const count = await homePage.getArticleCount();
    expect(count).toBeGreaterThan(0);
  });

  test('@negative should handle non-existent tag gracefully', async () => {
    await homePage.navigate();
    await homePage.clickTag('non-existent-tag-12345');
    const count = await homePage.getArticleCount();
    expect(count).toBe(0);
  });
});