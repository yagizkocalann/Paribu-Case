const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const HomePage = require('../../pages/web/homePage');
const MarketsPage = require('../../pages/web/marketsPage');

let homePage, marketsPage;

When('I sort the cryptocurrencies by descending market price', { timeout: 10000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    await this.page.waitForTimeout(3000);
    await marketsPage.sortByMarketPriceDescending();
    await this.page.waitForTimeout(5000);
});

When(/^I select (\d+) random green \(positive gain\) cryptocurrencies$/, { timeout: 20000 }, async function (count) {
    marketsPage = new MarketsPage(this.page);
    this.cryptoContexts = await marketsPage.selectRandomPositiveGainers(parseInt(count));
    await this.page.waitForTimeout(4000);
});

When('I open the selected cryptocurrencies in new tabs', async function () {
    marketsPage = new MarketsPage(this.page);
    // Deprecated: now handled inline in selectRandomPositiveGainers
});

When('I switch to the first crypto tab', async function () {
    marketsPage = new MarketsPage(this.page);
    const pages = this.page.context().pages();
    if (pages.length < 2) {
        console.error('Not enough pages open:', pages.length);
        throw new Error('Expected at least 2 tabs (homepage + first crypto)');
    }
    const targetPage = pages[1]; // 0 = homepage, 1 = first crypto
    await targetPage.bringToFront();
    this.page = targetPage;
    await this.page.waitForTimeout(4000);
});


When('I click a first buy order on the first tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = this.cryptoContexts?.[0];
    if (!context) throw new Error('Crypto tab context not available');
    this.page = context;
    await this.page.bringToFront();
    await marketsPage.clickFirstBuyOrderFromDom(this);
});

Then('I verify corresponding sell input fields in first tab', { timeout: 15000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstBuyOrder(this);
});


When('I click a first sell order on the first tab and verify the price input', { timeout: 20000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    const context = this.cryptoContexts?.[0];
    if (!context) throw new Error('Crypto tab context not available');
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickFirstSellOrderFromDom(this);
});

Then('I verify corresponding buy input fields fields in first tab', { timeout: 15000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstSellOrder(this);
});


When('I switch to the second crypto tab', async function () {
    const context = this.cryptoContexts?.[1];
    if (!context) throw new Error('Second tab not available');
    await context.bringToFront();
    this.page = context;
    await this.page.waitForTimeout(2000);
});


When('I click a first buy order on the second tab and verify the price input', async function () {
    const context = this.cryptoContexts?.[1];
    if (!context) throw new Error('Crypto tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.clickFirstBuyOrderFromDom(this);
});

When('I click a first sell order on the second tab and verify the price input', { timeout: 10000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    const context = this.cryptoContexts?.[1];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickFirstSellOrderFromDom(this);
});


When('I switch to the third crypto tab', async function () {
    const context = this.cryptoContexts?.[2];
    if (!context) throw new Error('Third tab not available');
    await context.bringToFront();
    this.page = context;
    await this.page.waitForTimeout(2000);
});


When('I click a first buy order on the third tab and verify the price input', async function () {
    const context = this.cryptoContexts?.[2];
    if (!context) throw new Error('Crypto tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.clickFirstBuyOrderFromDom(this);
});

When('I click a first sell order on the third tab and verify the price input', { timeout: 10000 }, async function () {
    marketsPage = new MarketsPage(this.page);
    const context = this.cryptoContexts?.[2];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickFirstSellOrderFromDom(this);
});

When('I verify that the Sell tab is active in the Buy-Sell form', async function () {
    marketsPage = new MarketsPage(this.page);
    const isActive = await marketsPage.isSellTabActive();
    expect(isActive).toBeTruthy();
});

Then('I verify corresponding sell input fields fields in second tab', async function () {
    const context = this.cryptoContexts?.[1];
    if (!context) throw new Error('Second tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstBuyOrder(this);
});

Then('I verify corresponding buy input fields fields in second tab', async function () {
    const context = this.cryptoContexts?.[1];
    if (!context) throw new Error('Second tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstSellOrder(this);
});

Then('I verify corresponding sell input fields fields in third tab', async function () {
    const context = this.cryptoContexts?.[2];
    if (!context) throw new Error('Third tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstBuyOrder(this);
});

Then('I verify corresponding buy input fields fields in third tab', async function () {
    const context = this.cryptoContexts?.[2];
    if (!context) throw new Error('Third tab context not available');
    await context.bringToFront();
    this.page = context;
    marketsPage = new MarketsPage(this.page);
    await marketsPage.verifyFormValuesMatchFirstSellOrder(this);
});