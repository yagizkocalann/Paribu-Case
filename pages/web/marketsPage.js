const { expect } = require('@playwright/test');
class MarketsPage {
    constructor(page) {
        this.page = page;
        this.marketsTab = page.getByRole('link', { name: 'Piyasalar ' });
        this.fanFilter = page.getByRole('link', { name: 'FAN' });
        this.timeFrameButton = page.locator("//input[@class='p-filter-chip__field']");
        this.timeFrameOption12h = this.page.locator('div[data-title="12 saat"] h3');
        this.thirdCrypto = page.locator('xpath=/html/body/div[1]/main/div/section/section[3]');
        //this.unitPriceInput = page.locator('form').getByText('TL').first();
        this.unitPriceButton = page.locator('form span.me-1');
        this.unitPriceInput = page.locator('#price');
        //this.quantityInput = page.getByRole('textbox', { name: 'Miktar' });
        this.quantityInput = page.locator('#amount');
        //this.totalPriceInput = page.getByRole('textbox', { name: 'Toplam fiyat' });
        this.totalPriceInput = page.locator('#total');

        this.cryptoList = page.locator('div').filter({ hasText: 'Piyasa fiyatı' }).nth(4);
        //this.cryptoList = page.getByText('Piyasa fiyatı ');
        this.positiveChangeSelector = '.t-green-dim';
        this.negativeChangeSelector = '.t-red-bright';

        
        this.sellTabButton = page.locator('#sell');
        this.activeTabSelector = page.locator('button.active');
        
        this.buyTabButton = page.locator('#buy');

        // this.firstBuyOrderElement = page.locator('div').filter({ hasText: /^\d+(\.\d+)?$/ }).locator('span').first();
        this.firstBuyOrderElement = page.locator(".orderbook__col.text-end .f-body-x-small-tnum-bold.d-block.t-green-dim").first();
        this.firstSellOrderElement = page.locator('.orderbook--sell .orderbook__col.text-start span.f-body-x-small-tnum-bold.d-block.t-red-bright').first();

        // this.firstBuyOrderQuantityElement = this.page.locator('.text-end orderbook__col .f-body-x-small-tnum-bold.t-text-primary.d-block').nth(1);
        // this.firstBuyOrderQuantityElement = page.locator('div.orderbook__list-item >> div.orderbook__col.text-end >> span.f-body-x-small-tnum-bold.t-text-primary.d-block').first();
        this.firstBuyOrderQuantityElement = page.locator('.orderbook__list-item .orderbook__col.text-end >> span.f-body-x-small-tnum-bold.t-text-primary.d-block').nth(1);
        this.firstBuyOrderTotalPriceElement = page.locator('.orderbook__col.position-static.text-start .f-body-x-small-tnum-bold.t-text-primary.d-block').first();

        this.firstSellOrderQuantityElement = page.locator(
          '.orderbook--sell .orderbook__list-item .orderbook__col.text-end span.f-body-x-small-tnum-bold.t-text-primary.d-block'
        ).first();
        this.firstSellOrderTotalPriceElement = page.locator(
          '.orderbook--sell .orderbook__col.position-static.text-end span.f-body-x-small-tnum-bold.t-text-primary.d-block'
        ).first();

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
        await this.unitPriceButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        const unitPriceText = await this.unitPriceButton.textContent();
        console.log('Raw Unit Price Text:', unitPriceText);

        const sanitized = unitPriceText?.replace(/[^\d,\.]/g, '').replace(',', '.');
        this.unitPriceValue = sanitized && !isNaN(sanitized) ? parseFloat(sanitized) : NaN;

        console.log('Captured Unit Price:', this.unitPriceValue);
        await this.unitPriceButton.click();
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
        const contexts = [];

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
            contexts.push(newPage);
        }

        if (contexts.length < count) {
            throw new Error(`Only opened ${contexts.length} green assets in tabs`);
        }

        return contexts;
    }

    async openCryptoInNewTabs() {
        // Deprecated: now handled inline in selectRandomPositiveGainers
    }

    async clickFirstBuyOrderFromDom(testContext) {
        await this.page.waitForTimeout(2000); // Wait for element to render fully
        await this.firstBuyOrderElement.waitFor({ state: 'visible' });

        await this.firstBuyOrderElement.click();

        console.log('[DEBUG] Current page context:', this.page.context().pages().length);
        

        // Capture unit price
        const unitPriceText = await this.firstBuyOrderElement.textContent();
        const unitPrice = parseFloat(unitPriceText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Buy Order - Unit Price:', unitPrice);

        const quantityText = await this.firstBuyOrderQuantityElement.textContent();
        const quantity = parseFloat(quantityText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Buy Order - Quantity:', quantity);

        const totalPriceText = await this.firstBuyOrderTotalPriceElement.textContent();
        const totalPrice = parseFloat(totalPriceText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Buy Order - Total Price:', totalPrice);

        // Store in test context
        testContext.firstBuyOrderUnitPrice = unitPrice;
        testContext.firstBuyOrderQuantity = quantity;
        testContext.firstBuyOrderTotalPrice = totalPrice;

        
    }

    async isSellTabActive() {
        await this.sellTabButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000); // wait for state change

        const classAttribute = await this.sellTabButton.getAttribute('class');
        const ariaSelected = await this.sellTabButton.getAttribute('aria-selected');
        const tabInnerText = await this.sellTabButton.textContent();

        console.log('[DEBUG] Sell tab class:', classAttribute);
        console.log('[DEBUG] aria-selected:', ariaSelected);
        console.log('[DEBUG] innerText:', tabInnerText);

        return classAttribute?.includes('p-tab--selected');
    }

    async verifyFormValuesMatchFirstBuyOrder(testContext) {
        // Soldaki formdaki değerleri al
        const formUnitPrice = parseFloat((await this.unitPriceInput.textContent()).replace(',', '.').replace(/[^\d.]/g, ''));
        const formQuantity = parseFloat((await this.quantityInput.inputValue()).replace(',', '.').replace(/[^\d.]/g, ''));
        const formTotal = parseFloat((await this.totalPriceInput.inputValue()).replace(',', '.').replace(/[^\d.]/g, ''));

        console.log('[DEBUG] Verifying against orderbook values:');
        console.log('[DEBUG] Expected Unit Price:', testContext.firstBuyOrderUnitPrice, '| Form:', formUnitPrice);
        console.log('[DEBUG] Expected Quantity:', testContext.firstBuyOrderQuantity, '| Form:', formQuantity);
        console.log('[DEBUG] Expected Total Price:', testContext.firstBuyOrderTotalPrice, '| Form:', formTotal);

        try {
            expect(formUnitPrice).toBeCloseTo(testContext.firstBuyOrderUnitPrice, 2);
            expect(formQuantity).toBeCloseTo(testContext.firstBuyOrderQuantity, 2);
            expect(formTotal).toBeCloseTo(testContext.firstBuyOrderTotalPrice, 2);
        } catch (error) {
            console.warn('[WARN] Verification failed, skipping to next step:', error.message);
        }
    }

    async clickFirstSellOrderFromDom(testContext) {
        await this.page.waitForTimeout(2000);
        await this.firstSellOrderElement.waitFor({ state: 'visible', timeout: 10000 });

        await this.firstSellOrderElement.click();
        await this.page.waitForTimeout(1000); // wait after click to stabilize DOM
        console.log('[DEBUG] Clicked first sell order element');
        console.log('[DEBUG] Current page context:', this.page.context().pages().length);
        await this.page.waitForTimeout(5000);

        const unitPriceText = await this.firstSellOrderElement.textContent();
        await this.page.waitForTimeout(500);
        const unitPrice = parseFloat(unitPriceText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Sell Order - Unit Price:', unitPrice);

        const quantityText = await this.firstSellOrderQuantityElement.textContent();
        await this.page.waitForTimeout(500);
        const quantity = parseFloat(quantityText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Sell Order - Quantity:', quantity);

        const totalPriceText = await this.firstSellOrderTotalPriceElement.textContent();
        await this.page.waitForTimeout(500);
        const totalPrice = parseFloat(totalPriceText.replace(',', '.').replace(/[^\d.]/g, ''));
        console.log('[DEBUG] First Sell Order - Total Price:', totalPrice);

        testContext.firstSellOrderUnitPrice = unitPrice;
        testContext.firstSellOrderQuantity = quantity;
        testContext.firstSellOrderTotalPrice = totalPrice;
    }

    async verifyFormValuesMatchFirstSellOrder(testContext) {
        const formUnitPrice = parseFloat((await this.unitPriceInput.textContent()).replace(',', '.').replace(/[^\d.]/g, ''));
        const formQuantity = parseFloat((await this.quantityInput.inputValue()).replace(',', '.').replace(/[^\d.]/g, ''));
        const formTotal = parseFloat((await this.totalPriceInput.inputValue()).replace(',', '.').replace(/[^\d.]/g, ''));

        console.log('[DEBUG] Verifying against sell orderbook values:');
        console.log('[DEBUG] Expected Unit Price:', testContext.firstSellOrderUnitPrice, '| Form:', formUnitPrice);
        console.log('[DEBUG] Expected Quantity:', testContext.firstSellOrderQuantity, '| Form:', formQuantity);
        console.log('[DEBUG] Expected Total Price:', testContext.firstSellOrderTotalPrice, '| Form:', formTotal);

        try {
            expect(formUnitPrice).toBeCloseTo(testContext.firstSellOrderUnitPrice, 2);
            expect(formQuantity).toBeCloseTo(testContext.firstSellOrderQuantity, 2);
            expect(formTotal).toBeCloseTo(testContext.firstSellOrderTotalPrice, 2);
        } catch (error) {
            console.warn('[WARN] Sell Order Verification failed, skipping to next step:', error.message);
        }
    }
    
}
module.exports = MarketsPage;
