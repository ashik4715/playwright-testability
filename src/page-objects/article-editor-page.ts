import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ArticleEditorPage extends BasePage {
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyInput: Locator;
  readonly tagsInput: Locator;
  readonly publishButton: Locator;
  readonly publishArticleButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly tagList: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.titleInput = page.locator('input[placeholder="Article Title"]');
    this.descriptionInput = page.locator('input[placeholder="What\'s this article about?"]');
    this.bodyInput = page.locator('textarea[placeholder="Write your article (in markdown)"]');
    this.tagsInput = page.locator('input[placeholder="Enter tags"]');
    this.publishButton = page.locator('button[type="button"]').filter({ hasText: 'Publish Article' });
    this.publishArticleButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-messages');
    this.successMessage = page.locator('.success-message');
    this.tagList = page.locator('.tag-list .tag-default');
    this.deleteButton = page.locator('button.btn-outline-danger');
  }

  async navigate(slug?: string): Promise<void> {
    const path = slug ? `/editor/${slug}` : '/editor';
    await super.navigate(path);
    await this.waitForPageLoad();
  }

  async createArticle(data: {
    title: string;
    description: string;
    body: string;
    tags?: string[];
  }): Promise<void> {
    await this.titleInput.fill(data.title);
    await this.descriptionInput.fill(data.description);
    await this.bodyInput.fill(data.body);

    if (data.tags && data.tags.length > 0) {
      for (const tag of data.tags) {
        await this.tagsInput.fill(tag);
        await this.page.keyboard.press('Enter');
      }
    }

    await this.publishArticleButton.click();
    await this.waitForPageLoad();
  }

  async updateArticle(data: {
    title?: string;
    description?: string;
    body?: string;
    tags?: string[];
  }): Promise<void> {
    if (data.title) {
      await this.titleInput.fill(data.title);
    }
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    if (data.body) {
      await this.bodyInput.fill(data.body);
    }

    if (data.tags) {
      await this.tagList.first().waitFor({ state: 'visible' }).catch(() => {});
      const existingTags = await this.tagList.count();
      for (let i = 0; i < existingTags; i++) {
        await this.tagList.nth(i).locator('.ion-close').click();
      }
      for (const tag of data.tags) {
        await this.tagsInput.fill(tag);
        await this.page.keyboard.press('Enter');
      }
    }

    await this.publishButton.click();
    await this.waitForPageLoad();
  }

  async getTitle(): Promise<string> {
    return await this.titleInput.inputValue();
  }

  async getDescription(): Promise<string> {
    return await this.descriptionInput.inputValue();
  }

  async getBody(): Promise<string> {
    return await this.bodyInput.inputValue();
  }

  async getTags(): Promise<string[]> {
    const count = await this.tagList.count();
    const tags: string[] = [];
    for (let i = 0; i < count; i++) {
      const tag = await this.tagList.nth(i).textContent();
      if (tag) {
        tags.push(tag.trim().replace('×', '').trim());
      }
    }
    return tags;
  }

  async deleteArticle(): Promise<void> {
    await this.deleteButton.click();
    await this.page.on('dialog', dialog => dialog.accept());
    await this.waitForPageLoad();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async getCurrentSlug(): Promise<string> {
    const url = await this.getCurrentUrl();
    const match = url.match(/\/editor\/(.+)/);
    return match ? match[1] : '';
  }
}