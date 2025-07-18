const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');
const { apiUrl } = require('../../config/env');

Given('the products modification endpoint is available', function () {
    this.productsEndpoint = `${apiUrl}/auth/products`;
});

When('I fetch the first product', async function () {
    const response = await axios.get(`${this.productsEndpoint}?limit=1`, {
        headers: { Authorization: `Bearer ${this.token}` }
    });
    this.response = response;
    this.firstProduct = response.data.products[0];
    this.productId = this.firstProduct.id;
    console.log('📦 Fetched product:', this.firstProduct);
});

When('I update the name of the product to {string}', async function (newName) {
    const response = await axios.put(`${this.productsEndpoint}/${this.productId}`, {
        title: newName
    }, {
        headers: { Authorization: `Bearer ${this.token}` }
    });
    this.response = response;
    this.updatedProduct = response.data;
    console.log('✏️ Updated product response:', this.updatedProduct);
});

Then('the product name should be updated to {string}', function (expectedName) {
    assert.strictEqual(this.updatedProduct.title, expectedName);
});

When('I delete the updated product', async function () {
    const response = await axios.delete(`${this.productsEndpoint}/${this.productId}`, {
        headers: { Authorization: `Bearer ${this.token}` }
    });
    this.response = response;
    console.log('🗑️ Delete response:', this.response.data);
});

Then('the product should no longer exist', async function () {
    console.log('🔍 Verifying deletion of product ID:', this.productId);
    try {
        await axios.get(`${this.productsEndpoint}/${this.productId}`, {
            headers: { Authorization: `Bearer ${this.token}` }
        });
        throw new Error('❌ Product still exists after deletion!');
    } catch (error) {
        if (!error.response) {
            throw new Error('❌ No response received while checking deleted product');
        }
        assert.strictEqual(error.response.status, 404, `❌ Expected 404, got ${error.response.status}`);
    }
});

Then('the delete response should match the deleted product', function () {
    assert.strictEqual(this.response.data.id, this.productId);
});