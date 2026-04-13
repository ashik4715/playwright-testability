import { test as BaseTest, Page } from '@playwright/test';
import { ApiClient } from './api-client';
import { testUser } from '../test-data/test-data';

class SessionManager {
  private static instance: SessionManager;
  private apiClient: ApiClient | null = null;
  private token: string | null = null;
  private user: { email: string; username: string; password: string } | null = null;

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

  async getAuthenticatedSession(credentials?: {
    email: string;
    password: string;
  }): Promise<{ apiClient: ApiClient; token: string }> {
    if (this.token && this.user && this.apiClient) {
      this.apiClient.setToken(this.token);
      return { apiClient: this.apiClient, token: this.token };
    }

    if (!this.apiClient) {
      await this.initialize();
    }

    const creds = credentials || testUser;
    await this.login(creds.email, creds.password);
    return { apiClient: this.apiClient!, token: this.token! };
  }

  async login(email: string, password: string): Promise<string> {
    if (!this.apiClient) {
      await this.initialize();
    }

    const result = await this.apiClient!.login(email, password);
    this.token = result.user.token;
    this.user = { email, password, username: '' };
    return result.user.token;
  }

  async dispose(): Promise<void> {
    if (this.apiClient) {
      await this.apiClient.dispose();
      this.apiClient = null;
    }
    this.token = null;
    this.user = null;
  }

  getToken(): string | null {
    return this.token;
  }

  getApiClient(): ApiClient | null {
    return this.apiClient;
  }
}

export const sessionManager = SessionManager.getInstance();

export const test = BaseTest.extend<{
  authenticatedPage: Page;
  apiClient: ApiClient;
}>({
  authenticatedPage: async ({ page }, use) => {
    const { token } = await sessionManager.getAuthenticatedSession();
    await page.addInitScript((tok: string) => {
      localStorage.setItem('jwt', tok);
    }, token);
    await use(page);
  },
  apiClient: async ({}, use) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    await use(apiClient);
  },
});

export { SessionManager };