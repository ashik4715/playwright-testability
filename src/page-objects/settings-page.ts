import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class SettingsPage extends BasePage {
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly bioInput: Locator;
  readonly imageInput: Locator;
  readonly updateSettingsButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[placeholder="Username"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.passwordInput = page.locator('input[placeholder="New Password"]');
    this.bioInput = page.locator('textarea[placeholder="Short bio about you"]');
    this.imageInput = page.locator('input[placeholder="URL of profile picture"]');
    this.updateSettingsButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-messages');
    this.successMessage = page.locator('.success-message');
    this.logoutButton = page.locator('button.btn-outline-danger').filter({ hasText: 'Or click here to logout.' });
  }

  async navigate(): Promise<void> {
    await super.navigate('/settings');
    await this.waitForPageLoad();
  }

  async updateSettings(data: {
    username?: string;
    email?: string;
    password?: string;
    bio?: string;
    image?: string;
  }): Promise<void> {
    if (data.username) {
      await this.usernameInput.fill(data.username);
    }
    if (data.email) {
      await this.emailInput.fill(data.email);
    }
    if (data.password) {
      await this.passwordInput.fill(data.password);
    }
    if (data.bio) {
      await this.bioInput.fill(data.bio);
    }
    if (data.image) {
      await this.imageInput.fill(data.image);
    }

    await this.updateSettingsButton.click();
    await this.waitForPageLoad();
  }

  async getUsername(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  async getEmail(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getBio(): Promise<string> {
    return await this.bioInput.inputValue();
  }

  async getImage(): Promise<string> {
    return await this.imageInput.inputValue();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.waitForPageLoad();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.fill('');
  }
}