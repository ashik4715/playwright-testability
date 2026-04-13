import { test, expect } from '@playwright/test';
import { HomePage, ArticleEditorPage, ArticlePage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';
import { sessionManager, test as authenticatedTest } from '../../utils/session-manager';

authenticatedTest.describe('Edit Article', () => {
  let homePage: HomePage;
  let editorPage: ArticleEditorPage;
  let articlePage: ArticlePage;

  authenticatedTest.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    editorPage = new ArticleEditorPage(page);
    articlePage = new ArticlePage(page);
  });

  authenticatedTest.afterEach(async () => {
    await sessionManager.dispose();
  });

  authenticatedTest('@positive should update article title', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tagList: TestDataGenerator.generateMultipleTags(1),
    });

    const slug = newArticle.article.slug;
    const newTitle = TestDataGenerator.generateArticleTitle();

    await articlePage.navigate(slug);
    await articlePage.clickEdit();
    
    await editorPage.updateArticle({ title: newTitle });

    await expect(page).toHaveURL(/article\/.*/);
    
    const actualTitle = await articlePage.getTitle();
    expect(actualTitle).toBe(newTitle);
  });

  authenticatedTest('@positive should update article body', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;
    const newBody = TestDataGenerator.generateArticleBody();

    await articlePage.navigate(slug);
    await articlePage.clickEdit();
    
    await editorPage.updateArticle({ body: newBody });

    await articlePage.navigate(slug);
    
    const actualBody = await articlePage.getBody();
    expect(actualBody).toContain(newBody.substring(0, 50));
  });

  authenticatedTest('@positive should add new tags to article', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tagList: ['oldtag'],
    });

    const slug = newArticle.article.slug;
    const newTags = TestDataGenerator.generateMultipleTags(2);

    await articlePage.navigate(slug);
    await articlePage.clickEdit();
    
    await editorPage.updateArticle({ tags: newTags });

    await articlePage.navigate(slug);
    
    const actualTags = await articlePage.getTags();
    expect(actualTags).toEqual(expect.arrayContaining(newTags));
  });

  authenticatedTest('@negative should not update with empty title', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    await articlePage.clickEdit();
    
    await editorPage.titleInput.fill('');
    await editorPage.publishButton.click();
    
    const errorMessage = await editorPage.getErrorMessage();
    expect(errorMessage).toContain('title');
  });

  authenticatedTest('@negative should not update with empty body', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    await articlePage.clickEdit();
    
    await editorPage.bodyInput.fill('');
    await editorPage.publishButton.click();
    
    const errorMessage = await editorPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('body');
  });

  authenticatedTest('@negative should not access edit page of another user article', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    
    const newArticle = await apiClient.createArticle({
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    });

    const slug = newArticle.article.slug;

    await articlePage.navigate(slug);
    
    await expect(articlePage.editButton).not.toBeVisible();
  });
});