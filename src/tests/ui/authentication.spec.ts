import { test, expect } from '@playwright/test';
import { HomePage, LoginPage } from '../../page-objects';

test.describe('Authentication', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  test('@negative should show error with empty email', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSignIn();
    await loginPage.emailInput.fill('');
    expect(await loginPage.signInButton.isDisabled()).toBe(true);
  });
});