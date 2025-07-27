const axios = require('axios');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const userId = 'user_' + Date.now();
  const CLIENT_ID = 'THE-APEX-INVESTOR-TEST-LCWOQ';
  const CONSUMER_KEY = 'cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e';
  const BASE_URL = 'https://api.snaptrade.com/api/v1';

  try {
    console.log('Registering user with userId:', userId);
    const registerResponse = await axios.post(
      `${BASE_URL}/snaptrade/registerUser`,
      { userId },
      { headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY } }
    );
    console.log('User registration response:', registerResponse.data);

    console.log('Requesting login URL...');
    const loginResponse = await axios.get(`${BASE_URL}/snaptrade/login`, {
      params: { userId, redirectURI: 'https://theapexinvestor.net/linked' },
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY },
    });
    console.log('Login response data:', loginResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: loginResponse.data.url, userId }),
    };
  } catch (err) {
    console.error('Error linking portfolio:', err.response ? err.response.data : err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Link failed',
        details: err.response ? err.response.data : err.message,
      }),
    };
  }
};