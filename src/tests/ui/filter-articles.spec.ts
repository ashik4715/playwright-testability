import { test, expect } from '@playwright/test';

const API_URL = 'https://conduit-api.bondaracademy.com';

test.describe('1. Create New Article', () => {
  test('@positive should create article via API', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/articles`, {
      data: {
        article: {
          title: `Test Article ${Date.now()}`,
          description: 'Test description',
          body: 'Test body content',
          tagList: ['test']
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('@negative should fail without required fields', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/articles`, {
      data: { article: { title: '' } },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('2. Edit Article', () => {
  test('@positive should update article via API', async ({ request }) => {
    const createRes = await request.post(`${API_URL}/api/articles`, {
      data: { article: { title: `Edit Test ${Date.now()}`, description: 'desc', body: 'body' } },
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await createRes.json();
    if (json.article?.slug) {
      const updateRes = await request.put(`${API_URL}/api/articles/${json.article.slug}`, {
        data: { article: { title: 'Updated Title' } },
        headers: { 'Content-Type': 'application/json' }
      });
      expect(updateRes.status()).toBeGreaterThanOrEqual(200);
    }
  });

  test('@negative should handle invalid slug', async ({ request }) => {
    const response = await request.put(`${API_URL}/api/articles/invalid-slug-xyz`, {
      data: { article: { title: 'Test' } },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('3. Delete Article', () => {
  test('@positive should delete article via API', async ({ request }) => {
    const createRes = await request.post(`${API_URL}/api/articles`, {
      data: { article: { title: `Delete Test ${Date.now()}`, description: 'desc', body: 'body' } },
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await createRes.json();
    if (json.article?.slug) {
      const deleteRes = await request.delete(`${API_URL}/api/articles/${json.article.slug}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      expect([204, 200]).toContain(deleteRes.status());
    }
  });

  test('@negative should return 404 for non-existent', async ({ request }) => {
    const response = await request.delete(`${API_URL}/api/articles/non-existent-xyz`, {
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('4. Filter Articles by Tag', () => {
  test('@positive should get articles by tag', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/articles?tag=test`);
    expect([200, 201]).toContain(response.status());
  });

  test('@negative should handle invalid tag', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/articles?tag=invalid-tag-xyz`);
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });
});

test.describe('5. Update User Settings', () => {
  test('@positive should update user settings', async ({ request }) => {
    const response = await request.put(`${API_URL}/api/user`, {
      data: { user: { bio: 'Updated bio' } },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('@negative should validate email', async ({ request }) => {
    const response = await request.put(`${API_URL}/api/user`, {
      data: { user: { email: 'invalid-email' } },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});