import { test, expect } from '@playwright/test';
import { HomePage, ArticleEditorPage, ArticlePage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';
import { sessionManager } from '../../utils/session-manager';

test.describe('Create New Article', () => {
  let homePage: HomePage;
  let editorPage: ArticleEditorPage;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    editorPage = new ArticleEditorPage(page);
    articlePage = new ArticlePage(page);
    await sessionManager.initialize();
  });

  test.afterEach(async () => {
    await sessionManager.dispose();
  });

  test('@positive should create a new article with all required fields', async ({ page }) => {
    const articleData = {
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tags: TestDataGenerator.generateMultipleTags(2),
    };

    await homePage.navigate();
    await homePage.clickNewArticle();
    await editorPage.createArticle(articleData);

    await expect(page).toHaveURL(/article\/.*/);
    
    const actualTitle = await articlePage.getTitle();
    expect(actualTitle).toBe(articleData.title);

    const actualTags = await articlePage.getTags();
    expect(actualTags.length).toBeGreaterThan(0);

    await expect(articlePage.editButton).toBeVisible();
    await expect(articlePage.favoriteButton).toBeVisible();
  });

  test('@positive should create a new article with single tag', async ({ page }) => {
    const articleData = {
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
      tags: [TestDataGenerator.generateRandomTag()],
    };

    await homePage.navigate();
    await homePage.clickNewArticle();
    await editorPage.createArticle(articleData);

    await expect(page).toHaveURL(/article\/.*/);
    
    const actualTags = await articlePage.getTags();
    expect(actualTags).toContain(articleData.tags[0]);
  });

  test('@negative should show error when title is empty', async ({ page }) => {
    const articleData = {
      title: '',
      description: TestDataGenerator.generateArticleDescription(),
      body: TestDataGenerator.generateArticleBody(),
    };

    await homePage.navigate();
    await homePage.clickNewArticle();
    
    await editorPage.descriptionInput.fill(articleData.description);
    await editorPage.bodyInput.fill(articleData.body);
    await editorPage.publishArticleButton.click();
    
    const errorMessage = await editorPage.getErrorMessage();
    expect(errorMessage).toContain('title');
  });

  test('@negative should show error when body is empty', async ({ page }) => {
    const articleData = {
      title: TestDataGenerator.generateArticleTitle(),
      description: TestDataGenerator.generateArticleDescription(),
      body: '',
    };

    await homePage.navigate();
    await homePage.clickNewArticle();
    
    await editorPage.titleInput.fill(articleData.title);
    await editorPage.descriptionInput.fill(articleData.description);
    await editorPage.publishArticleButton.click();
    
    const errorMessage = await editorPage.getErrorMessage();
    expect(errorMessage).toContain('body');
  });

  test('@negative should show error when description is empty', async ({ page }) => {
    const articleData = {
      title: TestDataGenerator.generateArticleTitle(),
      description: '',
      body: TestDataGenerator.generateArticleBody(),
    };

    await homePage.navigate();
    await homePage.clickNewArticle();
    
    await editorPage.titleInput.fill(articleData.title);
    await editorPage.bodyInput.fill(articleData.body);
    await editorPage.publishArticleButton.click();
    
    const errorMessage = await editorPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('description');
  });
});