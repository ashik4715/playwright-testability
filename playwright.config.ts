import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/ui',
  timeout: 10000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'https://conduit.bondaracademy.com',
    actionTimeout: 3000,
    navigationTimeout: 10000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});