import { test, expect } from '@playwright/test';
import { HomePage, LoginPage } from '../../page-objects';
import { testUser } from '../../test-data/test-data';

test.describe('Authentication', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
  });

  test('@positive should login with valid credentials', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSignIn();
    
    await loginPage.login(testUser.email, testUser.password);
    
    const isLoggedIn = await homePage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });

  test('@negative should show error with invalid credentials', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSignIn();
    
    await loginPage.login('invalid@test.com', 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('invalid');
  });

  test('@negative should show error with empty email', async ({ page }) => {
    await homePage.navigate();
    await homePage.clickSignIn();
    
    await loginPage.login('', testUser.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });
});