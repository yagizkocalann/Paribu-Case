const { Given, When, Then } = require('@cucumber/cucumber');
const { login, checkLoginEndpoint } = require('../../pages/api/authService');
const assert = require('assert');

Given('the login endpoint is available', async function () {
    const status = await checkLoginEndpoint();
    if (status !== 204) {
        throw new Error(`Login endpoint is not available. Status code: ${status}`);
    }
});

When('I send a login request with username {string} and password {string}', async function (username, password) {
    const res = await login(username, password);
    this.response = res;
});

Then('the login response status should be {int}', function (expectedStatus) {
    const actualStatus = this.response?.status;
    console.log(`📥 Expected: ${expectedStatus}, Got: ${actualStatus}`);
    assert.strictEqual(actualStatus, expectedStatus);
});



Then('I should receive a {int} response', function (expectedStatus) {
    const actualStatus = this.response?.status;
    console.log(`📥 Expected: ${expectedStatus}, Got: ${actualStatus}`);
    if (!actualStatus) {
        throw new Error('⚠️ No response object found.');
    }
    if (actualStatus !== expectedStatus) {
        throw new Error(`❌ Expected status ${expectedStatus} but got ${actualStatus}`);
    }
});

Then('if successful, I store the access token', function () {
    if (this.response?.status === 200) {
        this.token = this.response?.data?.token || this.response?.data?.accessToken;
        console.log('✅ Token stored in World:', this.token);
    } else {
        console.warn('⚠️ Token could not be stored. Status:', this.response?.status);
    }
});