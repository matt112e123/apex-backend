const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = 'THE-APEX-INVESTOR-TEST-LCWOQ';
const CONSUMER_KEY = 'cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e';
const BASE_URL = 'https://api.snaptrade.com/api/v1';

app.use(express.json());

app.post('/api/link-brokerage', async (req, res) => {
  const userId = 'user_' + Date.now();

  try {
    await axios.post(`${BASE_URL}/snaptrade/registerUser`, { userId }, {
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    const { data } = await axios.get(`${BASE_URL}/snaptrade/login`, {
      params: { userId, redirectURI: 'https://theapexinvestor.net/linked' },
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    res.status(200).json({ url: data.url, userId });
  } catch (error) {
    console.error('SnapTrade Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create link' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});