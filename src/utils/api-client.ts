import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config/constants';

export class ApiClient {
  private requestContext: APIRequestContext | null = null;
  private token: string | null = null;

  async init(): Promise<void> {
    this.requestContext = await request.newContext({
      baseURL: config.apiUrl,
    });
  }

  async dispose(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = null;
    }
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    return headers;
  }

  async post(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
    if (!this.requestContext) {
      throw new Error('API client not initialized. Call init() first.');
    }

    const headers = await this.getHeaders();
    const response = await this.requestContext.post(endpoint, {
      headers,
      data: body,
    });

    return {
      status: response.status(),
      body: response.ok() ? await response.json() : await response.text(),
    };
  }

  async get(endpoint: string, params?: Record<string, string>): Promise<unknown> {
    if (!this.requestContext) {
      throw new Error('API client not initialized. Call init() first.');
    }

    const headers = await this.getHeaders();
    const response = await this.requestContext.get(endpoint, {
      headers,
      params,
    });

    return {
      status: response.status(),
      body: response.ok() ? await response.json() : await response.text(),
    };
  }

  async put(endpoint: string, body: Record<string, unknown>): Promise<unknown> {
    if (!this.requestContext) {
      throw new Error('API client not initialized. Call init() first.');
    }

    const headers = await this.getHeaders();
    const response = await this.requestContext.put(endpoint, {
      headers,
      data: body,
    });

    return {
      status: response.status(),
      body: response.ok() ? await response.json() : await response.text(),
    };
  }

  async delete(endpoint: string): Promise<unknown> {
    if (!this.requestContext) {
      throw new Error('API client not initialized. Call init() first.');
    }

    const headers = await this.getHeaders();
    const response = await this.requestContext.delete(endpoint, {
      headers,
    });

    return {
      status: response.status(),
      body: response.ok() ? await response.json() : await response.text(),
    };
  }

  async login(email: string, password: string): Promise<{ user: { token: string } }> {
    const result = await this.post('/users/login', { user: { email, password } }) as { body: { user: { token: string } } };
    this.token = result.body.user.token;
    return result.body;
  }

  async register(username: string, email: string, password: string): Promise<{ user: { token: string } }> {
    const result = await this.post('/users', { user: { username, email, password } }) as { body: { user: { token: string } } };
    this.token = result.body.user.token;
    return result.body;
  }

  async createArticle(article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  }): Promise<{ article: { slug: string } }> {
    const result = await this.post('/articles', { article }) as { body: { article: { slug: string } } };
    return result.body;
  }

  async getArticles(params?: { tag?: string; author?: string; favorited?: string }): Promise<{ articles: unknown[]; articlesCount: number }> {
    const result = await this.get('/articles', params as Record<string, string>) as { body: { articles: unknown[]; articlesCount: number } };
    return result.body;
  }

  async deleteArticle(slug: string): Promise<void> {
    await this.delete(`/articles/${slug}`);
  }

  async updateArticle(slug: string, article: {
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
  }): Promise<{ article: { slug: string } }> {
    const result = await this.put(`/articles/${slug}`, { article }) as { body: { article: { slug: string } } };
    return result.body;
  }

  async getCurrentUser(): Promise<unknown> {
    const result = await this.get('/user') as { status: number; body: unknown };
    if (result.status === 401) {
      return null;
    }
    return result.body;
  }

  async updateUser(user: {
    email?: string;
    username?: string;
    password?: string;
    bio?: string;
    image?: string;
  }): Promise< unknown> {
    const result = await this.put('/user', { user }) as { body: unknown };
    return result.body;
  }
}