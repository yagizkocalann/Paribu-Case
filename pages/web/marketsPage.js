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
}

module.exports = MarketsPage;
