import { URL } from 'url';

export default async function handler(req, res) {
  // Set CORS headers here
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Only POST and OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-SnapTrade-Client-Id, X-SnapTrade-Client-Secret, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Respond with 200 OK for OPTIONS
  }

  // Ensure it's a POST request for the main logic
  if (req.method !== 'POST') { // <--- CRITICAL CHANGE: Expect POST
      return res.status(405).json({ error: `Method '${req.method}' Not Allowed. Use POST to call this backend endpoint.` });
  }

  let userId, userSecret;
  try {
    // <--- CRITICAL CHANGE: Get userId and userSecret from the request BODY for POST
    userId = req.body.userId;
    userSecret = req.body.userSecret;

    // For debugging: confirm what was received from the body
    console.log('Received userId from body:', userId, 'userSecret from body:', userSecret);

  } catch (parseError) {
    console.error('Error parsing request body:', parseError);
    return res.status(500).json({ error: 'Failed to parse request body.' });
  }

  // If parsing failed (e.g., body was not valid JSON or fields missing), return an error
  if (!userId || !userSecret) {
    return res.status(400).json({ error: 'Missing userId or userSecret in request body.' });
  }

  // Your SnapTrade API credentials
  const clientId = 'THE-APEX-INVESTOR-TEST-LCWOQ'; // Make sure this is correct
  const clientSecret = 'iV35ti80Zz4PdvxYeMToHKmiGHKolFOnjkGtA6SUJk38mHLRJf'; // Make sure this is correct

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
      console.error('SnapTrade returned non-JSON response:', raw);
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
      return res.status(snapRes.status || 400).json({ error: data.error || 'No redirect URI returned or unknown error from SnapTrade', raw });
    }

  } catch (err) {
    // Catch any network or unexpected errors during the fetch call to SnapTrade
    console.error('❌ SnapTrade fetch error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}