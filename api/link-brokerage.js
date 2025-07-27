import { URL } from 'url';

export default async function handler(req, res) {
  // Add CORS headers here
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-SnapTrade-Client-Id, X-SnapTrade-Client-Secret, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Your frontend calls this backend endpoint with a GET request
  if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed. Use GET to call this backend endpoint' });
  }

  // For debugging: see what original query parameters Vercel received
  console.log('Received original query:', req.query);

  let userId, userSecret;
  try {
    // Manually parse userId and userSecret from the full request URL
    const requestUrl = new URL(req.url, `http://${req.headers.host}`);
    userId = requestUrl.searchParams.get('userId');
    userSecret = requestUrl.searchParams.get('userSecret');
    // For debugging: confirm what was parsed
    console.log('Manually parsed userId:', userId, 'userSecret:', userSecret);
  } catch (parseError) {
    console.error('Error parsing URL manually:', parseError);
    return res.status(500).json({ error: 'Failed to parse URL parameters.' });
  }

  // If parsing failed, return an error to the frontend
  if (!userId || !userSecret) {
    return res.status(400).json({ error: 'Missing userId or userSecret after manual parsing' });
  }

  // Your SnapTrade API credentials
  const clientId = 'THE-APEX-INVESTOR-TEST-LCWOQ';
  const clientSecret = 'iV35ti80Zz4PdvxYeMToHKmiGHKolFOnjkGtA6SUJk38mHLRJf';

  try {
    // Call SnapTrade API:
    // 1. Use the Sandbox URL
    // 2. Use 'POST' method
    // 3. Send userId and userSecret in the request body as JSON
    const snapRes = await fetch(`https://api.snaptrade.com/api/v1/sandbox/snapTrade/connectionPortal`, {
      method: 'POST', // This is what SnapTrade requires
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json', // Important for sending JSON body
        'X-SnapTrade-Client-Id': clientId,
        'X-SnapTrade-Client-Secret': clientSecret
      },
      body: JSON.stringify({ // Send data in the body for POST
        userId: userId,
        userSecret: userSecret
      })
    });

    const raw = await snapRes.text();
    // For debugging: see SnapTrade's exact response
    console.log('📄 SnapTrade raw response:', raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      // If SnapTrade's response isn't valid JSON, return its raw content
      return res.status(500).json({ error: 'SnapTrade returned non-JSON response', raw });
    }

    // If SnapTrade responded successfully and provided a redirect URI
    if (snapRes.ok && data.redirectURI) {
      return res.status(200).json({ url: data.redirectURI });
    } else {
      // If SnapTrade returned an error, pass its details to the frontend
      if (data && data.detail) {
          return res.status(snapRes.status).json({ error: data.detail, code: data.code, status_code: data.status_code });
      }
      // Generic error if no specific detail from SnapTrade
      return res.status(400).json({ error: data.error || 'No redirect URI returned or unknown error from SnapTrade', raw });
    }

  } catch (err) {
    // Catch any network or unexpected errors during the fetch call to SnapTrade
    console.error('❌ SnapTrade fetch error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}