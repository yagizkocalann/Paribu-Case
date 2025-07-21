const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const axios = require('axios');
const { getToken } = require('../../pages/api/tokenHelper');

let response;
let responseTime;

Given('the products endpoint with delay parameter is available', function () {
});

When(
  'I send a GET request to products endpoint with delay {int}',
  { timeout: 10000 },
  async function (delay) {
    const token = await getToken();
    const url = `https://dummyjson.com/auth/products?delay=${delay}`;
    const startTime = Date.now();
    response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    responseTime = Date.now() - startTime;
  }
);

Then('the response time should be greater than 2000 milliseconds', function () {
  console.log(`⏱️ Actual response time: ${responseTime} ms`);
  expect(responseTime).toBeGreaterThan(2000);
});

Then('the response time should be less than or equal to 2000 milliseconds', function () {
  console.log(`⏱️ Actual response time: ${responseTime} ms`);
  expect(responseTime).toBeLessThanOrEqual(2000);
});