import { test as BaseTest, Page, Browser } from '@playwright/test';
import { ApiClient } from './api-client';
import { testUser } from '../test-data/test-data';

class SessionManager {
  private static instance: SessionManager;
  private apiClient: ApiClient | null = null;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async initialize(): Promise<void> {
    this.apiClient = new ApiClient();
    await this.apiClient.init();
  }

  async getAuthenticatedSession(): Promise<{ apiClient: ApiClient; token: string }> {
    if (this.token && this.apiClient) {
      this.apiClient.setToken(this.token);
      return { apiClient: this.apiClient, token: this.token };
    }

    if (!this.apiClient) {
      await this.initialize();
    }

    const result = await this.apiClient!.login(testUser.email, testUser.password);
    this.token = result.user.token;
    return { apiClient: this.apiClient!, token: this.token! };
  }

  async dispose(): Promise<void> {
    if (this.apiClient) {
      await this.apiClient.dispose();
      this.apiClient = null;
    }
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const sessionManager = SessionManager.getInstance();

export const test = BaseTest.extend<{
  authenticatedPage: Page;
  apiClient: ApiClient;
}>({
  authenticatedPage: async ({ page, browser }, use) => {
    await sessionManager.getAuthenticatedSession();
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForTimeout(2000);
    await use(page);
  },
  apiClient: async ({}, use) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    await use(apiClient);
  },
});

export { SessionManager };