const { expect } = require('@playwright/test');
class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.getByRole('link', { name: 'Giriş yap ' });
        this.mobileNumberInput = page.getByRole('textbox', { name: 'Cep telefonu numaranız' });
        this.passwordInput = page.getByRole('textbox', { name: 'Parolanız' });
        this.submitButton = page.getByRole('button', { name: 'Giriş yap' });
        this.errorMessage = page.getByText(/Girdiğiniz bilgileri kontrol edin/i);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async fillLoginForm(phone, password) {
        await this.mobileNumberInput.fill(phone);
        await this.passwordInput.fill(password);
    }

    async submitLogin() {
        await this.submitButton.click();
    }

    async getErrorMessage() {
        await this.errorMessage.waitFor({ state: 'visible' });
        return await this.errorMessage.textContent();
    }

    async assertPageLoaded() {
        await expect(this.loginButton).toBeVisible();
        await expect(this.mobileNumberInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.submitButton).toBeVisible();
    }
}

module.exports = LoginPage;