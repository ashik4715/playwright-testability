import { test, expect } from '@playwright/test';
import { HomePage, ArticlePage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';
import { sessionManager, test as authenticatedTest } from '../../utils/session-manager';

authenticatedTest.describe('Delete Article', () => {
  let homePage: HomePage;
  let articlePage: ArticlePage;

  authenticatedTest.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    articlePage = new ArticlePage(page);
  });

  authenticatedTest('@negative should handle delete of non-existent article', async () => {
    await articlePage.navigate('non-existent-123');
    const body = await articlePage.articleTitle.textContent().catch(() => '');
    expect(body).toBe('');
  });
});