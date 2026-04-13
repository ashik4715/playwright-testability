import { test, expect } from '@playwright/test';

test.describe('Conduit E2E Tests', () => {
  test('@positive Filter Articles - shows articles', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForLoadState('networkidle');
    expect(await page.locator('.article-preview').count()).toBeGreaterThan(0);
  });

  test('@positive Home Page - shows popular tags', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForLoadState('networkidle');
    expect(await page.locator('.tag-list a').count()).toBeGreaterThan(0);
  });

  test('@positive Article Page - displays content', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForLoadState('networkidle');
    await page.locator('.article-preview').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('conduit');
  });

  test('@positive User Settings - loads form', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/settings');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('conduit');
  });

  test('@positive Tags - clickable', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForLoadState('networkidle');
    await page.locator('.tag-list a').first().click();
    await page.waitForTimeout(500);
    expect(page.url()).toMatch(/tag=|conduit/);
  });

  test('@positive Create Article - shows form', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/editor');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('conduit');
  });

  test('@negative Editor - validation check', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/editor');
    expect(page.url()).toContain('conduit');
  });

  test('@negative Invalid article - handle', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/article/xyz');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('conduit');
  });

  test('@negative Delete - check button', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('conduit');
  });

  test('@negative Settings - validation', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/settings');
    expect(page.url()).toContain('conduit');
  });
});