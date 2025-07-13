import axios from 'axios';

const CLIENT_ID = 'THE-APEX-INVESTOR-TEST-LCWOQ';
const CONSUMER_KEY = 'cL3Joma3IF2OygJLOcKvTezOVuVLhMtOPexMkxDrGX0WyZIl3e';
const BASE_URL = 'https://api.snaptrade.com/api/v1';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const userId = 'user_' + Date.now();

  try {
    await axios.post(`${BASE_URL}/snaptrade/registerUser`, { userId }, {
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    const { data } = await axios.get(`${BASE_URL}/snaptrade/login`, {
      params: {
        userId,
        redirectURI: 'https://theapexinvestor.net/linked',
      },
      headers: { clientId: CLIENT_ID, consumerKey: CONSUMER_KEY }
    });

    return res.status(200).json({ url: data.url, userId });
  } catch (error) {
    console.error('Error in SnapTrade API:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Error creating link' });
  }
}
