const environments = {
    dev: {
      apiUrl: 'https://dummyjson.com',
      WebUrl: 'https://paribu.com'
    }
  };
  
  const currentEnv = process.env.ENV || 'dev';
  
  module.exports = environments[currentEnv];