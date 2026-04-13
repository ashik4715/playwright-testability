import { test, expect } from '@playwright/test';
import { ArticleEditorPage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';

test.describe('Create New Article', () => {
  let editorPage: ArticleEditorPage;

  test.beforeEach(async ({ page }) => {
    editorPage = new ArticleEditorPage(page);
  });

  test('@negative should show error when title is empty', async ({ page }) => {
    await editorPage.navigate();
    await editorPage.descriptionInput.fill('desc');
    await editorPage.bodyInput.fill('body');
    await editorPage.publishArticleButton.click();
    const error = await editorPage.getErrorMessage();
    expect(error.toLowerCase()).toContain('title');
  });

  test('@negative should show error when body is empty', async ({ page }) => {
    await editorPage.navigate();
    await editorPage.titleInput.fill('title');
    await editorPage.descriptionInput.fill('desc');
    await editorPage.publishArticleButton.click();
    const error = await editorPage.getErrorMessage();
    expect(error.toLowerCase()).toContain('body');
  });
});