import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ArticlePage extends BasePage {
  readonly articleTitle: Locator;
  readonly articleBody: Locator;
  readonly articleDescription: Locator;
  readonly authorName: Locator;
  readonly authorLink: Locator;
  readonly publishDate: Locator;
  readonly tagList: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly favoriteButton: Locator;
  readonly unfavoriteButton: Locator;
  readonly favoriteCount: Locator;
  readonly followButton: Locator;
  readonly unfollowButton: Locator;
  readonly commentSection: Locator;
  readonly commentInput: Locator;
  readonly postCommentButton: Locator;
  readonly commentsList: Locator;

  constructor(page: Page) {
    super(page);
    this.articleTitle = page.locator('.article-content h1');
    this.articleBody = page.locator('.article-content .article-body');
    this.articleDescription = page.locator('.article-content .article-description');
    this.authorName = page.locator('.author-name');
    this.authorLink = page.locator('.author-link');
    this.publishDate = page.locator('.date');
    this.tagList = page.locator('.tag-list .tag-pill');
    this.editButton = page.locator('a.btn-outline-secondary');
    this.deleteButton = page.locator('button.btn-outline-danger');
    this.favoriteButton = page.locator('button.btn-primary');
    this.unfavoriteButton = page.locator('button.btn-outline-primary');
    this.favoriteCount = page.locator('.favorites-count');
    this.followButton = page.locator('button.btn-outline-secondary').filter({ hasText: 'Follow' });
    this.unfollowButton = page.locator('button.btn-secondary').filter({ hasText: 'Unfollow' });
    this.commentSection = page.locator('.comment-section');
    this.commentInput = page.locator('textarea[placeholder="Write a comment..."]');
    this.postCommentButton = page.locator('button[type="submit"]').filter({ hasText: 'Post Comment' });
    this.commentsList = page.locator('.comment-list .card');
  }

  async navigate(slug: string): Promise<void> {
    await super.navigate(`/article/${slug}`);
    await this.waitForPageLoad();
  }

  async getTitle(): Promise<string> {
    return await this.articleTitle.textContent() || '';
  }

  async getDescription(): Promise<string> {
    return await this.articleDescription.textContent() || '';
  }

  async getBody(): Promise<string> {
    return await this.articleBody.textContent() || '';
  }

  async getAuthor(): Promise<string> {
    return await this.authorName.textContent() || '';
  }

  async getTags(): Promise<string[]> {
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

  async getFavoriteCount(): Promise<number> {
    const countText = await this.favoriteCount.textContent() || '0';
    return parseInt(countText, 10);
  }

  async clickFavorite(): Promise<void> {
    await this.favoriteButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickUnfavorite(): Promise<void> {
    await this.unfavoriteButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
    await this.waitForPageLoad();
  }

  async clickDelete(): Promise<void> {
    this.page.on('dialog', dialog => dialog.accept());
    await this.deleteButton.click();
    await this.waitForPageLoad();
  }

  async isFavoriteButtonVisible(): Promise<boolean> {
    return await this.favoriteButton.count() > 0;
  }

  async isEditButtonVisible(): Promise<boolean> {
    return await this.editButton.count() > 0;
  }

  async postComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await this.postCommentButton.click();
    await this.page.waitForTimeout(500);
  }

  async getCommentCount(): Promise<number> {
    return await this.commentsList.count();
  }
}