const axios = require('axios');
const { apiUrl } = require('../../config/env');

async function login(username, password) {
  try {
    const res = await axios.post(`${apiUrl}/auth/login`, {
      username,
      password
    });
    return res;
  } catch (error) {
    return error.response;
  }
}

async function checkLoginEndpoint() {
  try {
    const res = await axios.options(`${apiUrl}/auth/login`);
    return res.status;
  } catch (error) {
    return error.response?.status || 500;
  }
}

module.exports = {
  login,
  checkLoginEndpoint
};