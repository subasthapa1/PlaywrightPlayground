import { test, expect } from '@playwright/test';

test('Has correct title', async ({ page }) => {
  await page.goto('https://login.salesforce.com');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Login | Salesforce');
});

test('Invalid Login', async ({ page }) => {
    await page.goto('https://login.salesforce.com');
    const locatorUsername = page.locator('#username');
    const locatorPassword = page.locator('#password');
    const locatorButton = page.locator('#Login');

    //Wait until the elements are loaded
    await expect(locatorUsername).toBeVisible();
    await expect(locatorPassword).toBeVisible();
    await expect(locatorButton).toBeVisible();

    //Enter credentials
    await locatorUsername.fill('s.th@wlv.ac.uk');
    await locatorPassword.fill('Invalid123');
    await locatorButton.click({ force: true });

    //Assert for invalid credentials
    const message = page.locator('div#error');

    const errorMessage = page.locator('#error');
    await expect(message).toHaveText("Please check your username and password. If you still can't log in, contact your Salesforce administrator.");


  });