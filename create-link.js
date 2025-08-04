const axios = require('axios');

const CLIENT_ID = 'THE-APEX-INVESTOR-TEST-LCWOQ';
const CONSUMER_KEY = 'cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e';
const BASE_URL = 'https://api.snaptrade.com/api/v1';

module.exports = async (req, res) => {
  // Only allow POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Generate a unique userId for each request
  const userId = 'user_' + Date.now();

  try {
    // Register the user with SnapTrade
    await axios.post(`${BASE_URL}/snaptrade/registerUser`, { userId }, {
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    // Get the login URL for SnapTrade linking widget
    const { data } = await axios.get(`${BASE_URL}/snaptrade/login`, {
      params: {
        userId,
        redirectURI: 'https://theapexinvestor.net/linked' // Your frontend redirect URL after linking
      },
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    // Respond with the URL so frontend can redirect user
    return res.status(200).json({ url: data.url, userId });

  } catch (error) {
    console.error('Error in SnapTrade API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Error creating link' });
  }
};
