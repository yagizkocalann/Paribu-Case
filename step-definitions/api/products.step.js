const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');
const { apiUrl } = require('../../config/env');

Given('the products endpoint is available', function () {
    this.productsEndpoint = `${apiUrl}/auth/products`;
});

When('I send a GET request to products endpoint with limit {int}', async function (limit) {
    const urlWithQuery = `${this.productsEndpoint}?limit=${limit}`;
    try {
        const res = await axios.get(urlWithQuery, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        this.response = res;
        console.log('📦 Products response:', JSON.stringify(res.data, null, 2));
        this.limit = limit;
    } catch (error) {
        this.response = error.response;
        console.error('❌ Request failed:', error.response?.status, error.response?.data ?? error.message);
    }
});

Then('the products response status should be {int}', function (expectedStatus) {
    const actualStatus = this.response?.status;
    assert.strictEqual(actualStatus, expectedStatus);
});

Then('the response should contain {int} number of products', function (expectedCount) {
    const products = this.response?.data?.products;

    if (!products || !Array.isArray(products)) {
        throw new Error('❌ Products array not found or invalid in response!');
    }

    console.log(`✅ Found ${products.length} products`);
    console.log('📋 Products array:', products);

    assert.strictEqual(products.length, expectedCount, `❌ Expected ${expectedCount} products, but got ${products.length}`);
});
