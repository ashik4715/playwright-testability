import { test, expect } from '@playwright/test';
import { ArticlePage } from '../../page-objects';

test.describe('Article Page', () => {
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    articlePage = new ArticlePage(page);
  });

  test('@negative should handle non-existent article', async () => {
    await articlePage.navigate('non-existent-slug');
    const title = await articlePage.articleTitle.textContent().catch(() => '');
    expect(title).toBe('');
  });
});