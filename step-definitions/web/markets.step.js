const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../../pages/web/homePage');
const MarketsPage = require('../../pages/web/marketsPage');
const { WebUrl } = require('../../config/env');

let homePage, marketsPage;

Given('I navigate to the Paribu homepage', async function () {
    homePage = new HomePage(this.page);
    marketsPage = new MarketsPage(this.page);
    await homePage.goto(WebUrl);
});

When('I close the cookie notice', async function () {
    await homePage.waitForCookieButton();
    await homePage.closeCookies();
});

When('I go to the Markets page', async function () {
    await marketsPage.goToMarkets();
});

When('I filter the list by FAN', async function () {
    await marketsPage.selectFanFilter();
});

When('I change the price change timeframe to {int} hours', async function (hours) {
    await marketsPage.setTimeframe(hours);
});

When('I click the third cryptocurrency on the list', async function () {
    await marketsPage.clickThirdCrypto();
});

When('I input the current price into the Unit Price field', async function () {
    await marketsPage.inputCurrentPriceToUnitPrice();
});

When('I input {string} into the Quantity field', async function (quantity) {
    await marketsPage.inputQuantity(quantity);
});

Then('I should see the correct total price calculated', async function () {
    const expectedQuantity = 5;
    const isCorrect = await marketsPage.getTotalPriceValue(expectedQuantity);
    expect(isCorrect).toBe(true);
});