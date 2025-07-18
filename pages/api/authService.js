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

module.exports = {
  login
};