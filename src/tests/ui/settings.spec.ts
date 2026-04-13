import { test, expect } from '@playwright/test';
import { HomePage, SettingsPage } from '../../page-objects';
import { TestDataGenerator } from '../../test-data/test-data';
import { sessionManager, test as authenticatedTest } from '../../utils/session-manager';

authenticatedTest.describe('Update User Settings', () => {
  let homePage: HomePage;
  let settingsPage: SettingsPage;

  authenticatedTest.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    settingsPage = new SettingsPage(page);
  });

  authenticatedTest.afterEach(async () => {
    await sessionManager.dispose();
  });

  authenticatedTest('@positive should update user bio', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    const newBio = TestDataGenerator.generateUserBio();
    await settingsPage.updateSettings({ bio: newBio });
    
    await settingsPage.navigate();
    
    const actualBio = await settingsPage.getBio();
    expect(actualBio).toBe(newBio);
  });

  authenticatedTest('@positive should update user image', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    const newImage = 'https://example.com/new-avatar.jpg';
    await settingsPage.updateSettings({ image: newImage });
    
    await settingsPage.navigate();
    
    const actualImage = await settingsPage.getImage();
    expect(actualImage).toBe(newImage);
  });

  authenticatedTest('@positive should update email successfully', async ({ page }) => {
    const { apiClient } = await sessionManager.getAuthenticatedSession();
    const currentUser = await apiClient.getCurrentUser() as { user: { email: string } };
    const currentEmail = currentUser.user.email;
    
    await homePage.navigate();
    await homePage.clickSettings();
    
    const newEmail = TestDataGenerator.generateRandomEmail();
    await settingsPage.updateSettings({ email: newEmail });
    
    await settingsPage.navigate();
    
    const actualEmail = await settingsPage.getEmail();
    expect(actualEmail).not.toBe(currentEmail);
  });

  authenticatedTest('@negative should show error with invalid email format', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    const invalidEmail = 'invalidemail';
    await settingsPage.updateSettings({ email: invalidEmail });
    
    const errorMessage = await settingsPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('email');
  });

  authenticatedTest('@negative should show error with invalid image URL', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    const invalidImage = 'not-a-valid-url';
    await settingsPage.updateSettings({ image: invalidImage });
    
    const errorMessage = await settingsPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('image');
  });

  authenticatedTest('@negative should show error with short password', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    const shortPassword = TestDataGenerator.generateShortPassword();
    await settingsPage.updateSettings({ password: shortPassword });
    
    const errorMessage = await settingsPage.getErrorMessage();
    expect(errorMessage.toLowerCase().length).toBeGreaterThan(0);
  });

  authenticatedTest('@positive should allow updating without changing password', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSettings();
    
    await settingsPage.clearPassword();
    await settingsPage.updateSettings({ bio: TestDataGenerator.generateUserBio() });
    
    const successMessage = await settingsPage.getSuccessMessage();
    const lowerSuccess = successMessage.toLowerCase();
    const isSuccess = lowerSuccess.includes('updated') || lowerSuccess.includes('success') || lowerSuccess.length > 0;
    expect(isSuccess).toBeTruthy();
  });
});