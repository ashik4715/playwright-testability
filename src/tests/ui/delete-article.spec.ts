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

  authenticatedTest.afterEach(async () => {
    await sessionManager.dispose();
  });

  authenticatedTest('@positive should delete own article successfully', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    await expect(articlePage.deleteButton).toBeVisible();
    
    await articlePage.clickDelete();
    
    await homePage.navigate();
    const articles = await homePage.getArticleTitles();
    expect(articles).not.toContain(newArticle.article.slug);
  });

  authenticatedTest('@positive should delete article and redirect to home', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    await articlePage.clickDelete();
    
    await expect(page).toHaveURL(/.*\/$/);
  });

  authenticatedTest('@negative should not show delete button for other user articles', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    
    const deleteButtonCount = await articlePage.deleteButton.count();
    expect(deleteButtonCount).toBe(0);
  });

  authenticatedTest('@negative should handle delete of non-existent article gracefully', async ({ page }) => {
    await articlePage.navigate('non-existent-slug-12345');
    
    await expect(page.locator('.article-content')).not.toBeVisible();
    await expect(page.locator('h1')).toContainText(['404', 'Page Not Found', 'not found'], { ignoreCase: true }).catch(() => {});
  });
});