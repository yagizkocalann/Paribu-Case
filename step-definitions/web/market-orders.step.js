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
    await marketsPage.selectRandomPositiveGainers(parseInt(count));
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


When('I click a random buy order on the first tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[0];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomBuyOrderAndVerifyInput(context);
});

When('I click a random sell order on the first tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[0];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomSellOrderAndVerifyInput(context);
});


When('I switch to the second crypto tab', async function () {
    const context = marketsPage.cryptoContexts?.[1];
    if (!context) throw new Error('Second tab not available');
    await context.bringToFront();
    this.page = context;
    await this.page.waitForTimeout(2000);
});


When('I click a random buy order on the second tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[1];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomBuyOrderAndVerifyInput(context);
});

When('I click a random sell order on the second tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[1];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomSellOrderAndVerifyInput(context);
});


When('I switch to the third crypto tab', async function () {
    const context = marketsPage.cryptoContexts?.[2];
    if (!context) throw new Error('Third tab not available');
    await context.bringToFront();
    this.page = context;
    await this.page.waitForTimeout(2000);
});


When('I click a random buy order on the third tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[2];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomBuyOrderAndVerifyInput(context);
});

When('I click a random sell order on the third tab and verify the price input', async function () {
    marketsPage = new MarketsPage(this.page);
    const context = marketsPage.cryptoContexts?.[2];
    this.page = context;
    await context.bringToFront();
    await marketsPage.clickRandomSellOrderAndVerifyInput(context);
});

When('I verify that the Sell tab is active in the Buy-Sell form', async function () {
    marketsPage = new MarketsPage(this.page);
    const isActive = await marketsPage.isSellTabActive();
    expect(isActive).toBeTruthy();
});