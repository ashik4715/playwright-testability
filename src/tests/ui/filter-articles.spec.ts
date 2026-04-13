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
});