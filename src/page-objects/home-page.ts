import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly popularTagsSection: Locator;
  readonly tagList: Locator;
  readonly articleList: Locator;
  readonly articlePreviewList: Locator;
  readonly noArticlesMessage: Locator;
  readonly userDropdown: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.locator('.logo-font');
    this.homeLink = page.locator('a[href="/"]').first();
    this.signInLink = page.locator('a[href="/login"]');
    this.signUpLink = page.locator('a[href="/register"]');
    this.globalFeedTab = page.locator('a[href="/"]').filter({ hasText: 'Global Feed' });
    this.yourFeedTab = page.locator('a[href="/"]').filter({ hasText: 'Your Feed' });
    this.popularTagsSection = page.locator('.sidebar .tag-list');
    this.tagList = page.locator('.tag-list a');
    this.articleList = page.locator('.article-preview');
    this.articlePreviewList = page.locator('.article-preview');
    this.noArticlesMessage = page.locator('.article-preview').first();
    this.userDropdown = page.locator('.nav-item.dropdown');
    this.newArticleLink = page.locator('a[href="/editor"]');
    this.settingsLink = page.locator('a[href="/settings"]');
    this.logoutLink = page.locator('a[href="/logout"]');
  }

  async navigate(): Promise<void> {
    await super.navigate('/');
    await this.waitForPageLoad();
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  async clickGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
    await this.waitForPageLoad();
  }

  async clickYourFeed(): Promise<void> {
    await this.yourFeedTab.click();
    await this.waitForPageLoad();
  }

  async getPopularTags(): Promise<string[]> {
    await this.popularTagsSection.waitFor();
    const count = await this.tagList.count();
    const tags: string[] = [];
    for (let i = 0; i < count; i++) {
      const tag = await this.tagList.nth(i).textContent();
      if (tag) {
        tags.push(tag.trim());
      }
    }
    return tags;
  }

  async clickTag(tagName: string): Promise<void> {
    await this.tagList.filter({ hasText: tagName }).click();
    await this.waitForPageLoad();
  }

  async getArticleCount(): Promise<number> {
    await this.articleList.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return await this.articleList.count();
  }

  async getArticleTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.articleList.count();
    for (let i = 0; i < count; i++) {
      const title = await this.articleList.nth(i).locator('.preview-link h1').textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    return titles;
  }

  async openFirstArticle(): Promise<void> {
    await this.articleList.first().locator('.preview-link').click();
    await this.waitForPageLoad();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.userDropdown.count() > 0;
  }

  async clickNewArticle(): Promise<void> {
    await this.page.goto('/editor');
  }

  async clickSettings(): Promise<void> {
    await this.page.goto('/settings');
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutLink.click();
    await this.waitForPageLoad();
  }
}