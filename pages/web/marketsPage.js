const { expect } = require('@playwright/test');
class MarketsPage {
    constructor(page) {
        this.page = page;
        this.marketsTab = page.getByRole('link', { name: 'Piyasalar ' });
        this.fanFilter = page.getByRole('link', { name: 'FAN' });
        this.timeFrameButton = page.locator('xpath=/html/body/div[1]/main/div/div[2]/div[2]/div[1]');
        this.timeFrameOption12h = this.page.locator('div[data-title="12 saat"] h3');
        this.thirdCrypto = page.locator('xpath=/html/body/div[1]/main/div/section/section[3]');
        //this.unitPriceInput = page.locator('form').getByText('TL').first();
        this.unitPriceInput = page.locator('form span.me-1');
        //this.quantityInput = page.getByRole('textbox', { name: 'Miktar' });
        this.quantityInput = page.locator('#amount');
        //this.totalPriceInput = page.getByRole('textbox', { name: 'Toplam fiyat' });
        this.totalPriceInput = page.locator('#total');

        this.cryptoList = page.locator('div').filter({ hasText: 'Piyasa fiyatı' }).nth(4);
        //this.cryptoList = page.getByText('Piyasa fiyatı ');
        this.positiveChangeSelector = '.t-green-dim';
        this.negativeChangeSelector = '.t-red-bright';

        this.cryptoContexts = []; // initialize here to ensure it exists

        this.sellTabButton = page.locator('#sell');
        this.activeTabSelector = page.locator('button.active');

        this.firstBuyOrderXPath = page.locator('xpath=/html/body/div[1]/main/div[2]/div[2]/div/div[2]/div/div[2]/div/div');
    }

    async goToMarkets() {
        await this.marketsTab.click();
    }

    async selectFanFilter() {
        await this.fanFilter.click();
    }

    async setTimeframe(hours) {
        await this.timeFrameButton.click();
        await this.timeFrameOption12h.waitFor({ state: 'visible' });
        await this.timeFrameOption12h.click();
    }

    async clickThirdCrypto() {
        await this.thirdCrypto.click();
    }

    async inputCurrentPriceToUnitPrice() {
        await this.unitPriceInput.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        const unitPriceText = await this.unitPriceInput.textContent();
        console.log('Raw Unit Price Text:', unitPriceText);

        const sanitized = unitPriceText?.replace(/[^\d,\.]/g, '').replace(',', '.');
        this.unitPriceValue = sanitized && !isNaN(sanitized) ? parseFloat(sanitized) : NaN;

        console.log('Captured Unit Price:', this.unitPriceValue);
        await this.unitPriceInput.click();
    }

    async inputQuantity(quantity) {
        await this.quantityInput.waitFor({ state: 'visible' });
        await this.quantityInput.click();
        await this.quantityInput.fill(quantity);
        await this.page.waitForTimeout(2000);
    }

    async getTotalPriceValue(expectedQuantity) {
        console.log('Expected Quantity:', expectedQuantity);
        for (let i = 0; i < 5; i++) {
            const totalPriceValueText = await this.totalPriceInput.inputValue();
            const sanitizedTotal = totalPriceValueText.replace(',', '.').replace(/[^\d.]/g, '');
            const totalPrice = parseFloat(sanitizedTotal);
            const expectedTotal = parseFloat((this.unitPriceValue * parseFloat(expectedQuantity)).toFixed(2));
            console.log('Expected Total:', expectedTotal, '| Actual Total:', totalPrice);
            if (Math.abs(expectedTotal - totalPrice) < 0.01) {
                return true;
            }
            await this.page.waitForTimeout(500);
        }
        return false;
    }

    async sortByMarketPriceDescending() {
        await this.cryptoList.click();
        await this.cryptoList.click();
    }

    // Placeholder for step definitions used in market-orders.step.js
    async selectRandomPositiveGainers(count) {
        await this.page.waitForSelector('section.market-list__item');
        const greenMarkets = await this.page.$$('section.market-list__item:has(.t-green-dim)');

        if (greenMarkets.length === 0) {
            throw new Error('No positive gain cryptocurrencies found.');
        }

        const selected = greenMarkets.sort(() => 0.5 - Math.random()).slice(0, count);
        this.cryptoContexts = [];

        for (const market of selected) {
            // Try to find an <a> inside to get href
            const anchor = await market.$('a');
            const href = anchor ? await anchor.getAttribute('href') : null;

            if (!href) continue;

            const [newPage] = await Promise.all([
                this.page.context().waitForEvent('page'),
                this.page.evaluate(url => window.open(url, '_blank'), href)
            ]);

            await newPage.waitForLoadState();
            this.cryptoContexts.push(newPage);
        }

        if (this.cryptoContexts.length < count) {
            throw new Error(`Only opened ${this.cryptoContexts.length} green assets in tabs`);
        }
    }

    async openCryptoInNewTabs() {
        // Deprecated: now handled inline in selectRandomPositiveGainers
    }

    async isSellTabActive() {
        await this.sellTabButton.waitFor({ state: 'visible' });

        const classAttribute = await this.sellTabButton.getAttribute('class');
        console.log('[DEBUG] Sell tab class:', classAttribute);
        console.log('[REPORT] Sell tab is active:', classAttribute?.includes('p-tab--selected'));
        return classAttribute?.includes('p-tab--selected');
    }

    async clickFirstBuyOrderFromDom() {
        await this.firstBuyOrderXPath.waitFor({ state: 'visible' });
        await this.firstBuyOrderXPath.click();
    }
}
module.exports = MarketsPage;
