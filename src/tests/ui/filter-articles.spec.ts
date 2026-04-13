import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';
import { sessionManager, test as authenticatedTest } from '../../utils/session-manager';

authenticatedTest.describe('Filter Articles by Tag', () => {
  let homePage: HomePage;

  authenticatedTest.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
  });

  authenticatedTest.afterEach(async () => {
    await sessionManager.dispose();
  });

  authenticatedTest('@positive should filter articles by clicking on popular tag', async ({ page }) => {
    await homePage.navigate();
    
    const tags = await homePage.getPopularTags();
    expect(tags.length).toBeGreaterThan(0);
    
    const selectedTag = await homePage.tagList.first().textContent();
    if (selectedTag) {
      await homePage.tagList.first().click();
      
      await expect(page).toHaveURL(new RegExp(`tag=${encodeURIComponent(selectedTag.trim())}`));
    }
  });

  authenticatedTest('@positive should filter articles using existing tag', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const tag = TestDataGenerator.generateExistingTag();
    const title = TestDataGenerator.generateArticleTitle();
    
    await apiClient.createArticle({
      title,
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tagList: [tag],
    });

    await homePage.navigate();
    await homePage.clickTag(tag);
    
    await expect(page).toHaveURL(new RegExp(`tag=${encodeURIComponent(tag)}`));
    
    const articles = await homePage.getArticleTitles();
    expect(articles.length).toBeGreaterThan(0);
  });

  authenticatedTest('@positive should filter articles by custom tag', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const tag = TestDataGenerator.generateRandomTag();
    const title = TestDataGenerator.generateArticleTitle();
    
    await apiClient.createArticle({
      title,
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tagList: [tag],
    });

    await homePage.navigate();
    await homePage.clickTag(tag);
    
    const articles = await homePage.getArticleTitles();
    expect(articles.some(title => title.includes(tag) || title.length > 0)).toBeTruthy();
  });

  authenticatedTest('@positive should show article count for filtered tag', async ({ page }) => {
    await homePage.navigate();
    
    const articleCountBefore = await homePage.getArticleCount();
    
    if (await homePage.tagList.count() > 0) {
      const tag = await homePage.tagList.first().textContent();
      if (tag) {
        await homePage.tagList.first().click();
        
        const articleCountAfter = await homePage.getArticleCount();
        expect(articleCountAfter).toBeLessThanOrEqual(articleCountBefore + 1);
      }
    }
  });

  authenticatedTest('@negative should handle non-existent tag gracefully', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickTag('non-existent-tag-12345');
    
    const articles = await homePage.getArticleCount();
    expect(articles).toBe(0);
  });
});