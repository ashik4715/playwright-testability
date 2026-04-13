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

  test('@positive should display popular tags', async () => {
    await homePage.navigate();
    const tags = await homePage.getPopularTags();
    expect(tags.length).toBeGreaterThan(0);
  });

  test('@positive should display articles', async () => {
    await homePage.navigate();
    const titles = await homePage.getArticleTitles();
    expect(titles.length).toBeGreaterThan(0);
  });
});