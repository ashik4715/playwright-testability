import { test, expect } from '@playwright/test';
import { SettingsPage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';

test.describe('Update User Settings', () => {
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
  });

  test('@negative should show error with invalid email format', async () => {
    await settingsPage.navigate();
    await settingsPage.updateSettings({ email: 'invalid' });
    const error = await settingsPage.getErrorMessage();
    expect(error.toLowerCase()).toContain('email');
  });
});