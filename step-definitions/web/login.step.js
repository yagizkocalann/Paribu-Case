const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../../pages/web/homePage');
const LoginPage = require('../../pages/web/loginPage');
const { WebUrl } = require('../../config/env');

let homePage, loginPage;

Given('I open the Paribu homepage for login', async function () {
    homePage = new HomePage(this.page);
    loginPage = new LoginPage(this.page);
    await homePage.goto(WebUrl);
});

When('I dismiss the cookie banner on login page', async function () {
    await homePage.waitForCookieButton();
    await homePage.closeCookies();
});

When('I click the Login button', async function () {
    await loginPage.clickLoginButton();
});

When('I enter an invalid mobile number and password', async function () {
    await loginPage.fillLoginForm('+90 (530) 613 33 41', '12345qwert');
});

When('I click the Submit button', async function () {
    await loginPage.submitLogin();
});

Then('I should see an error message saying {string}', async function (expectedMessage) {
    const errorText = await loginPage.getErrorMessage();
    console.log('🔍 Error message on screen:', errorText);
    expect(errorText).toContain(expectedMessage);
});