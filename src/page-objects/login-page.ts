import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly needAccountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-messages');
    this.needAccountLink = page.locator('a[href="/register"]');
  }

  async navigate(): Promise<void> {
    await super.navigate('/login');
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.waitForPageLoad();
  }

  async isSignedIn(): Promise<boolean> {
    await this.page.waitForTimeout(1000);
    const userElement = this.page.locator('.nav-item a[href*="profile"]');
    return await userElement.count() > 0;
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}