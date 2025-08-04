export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://theapexinvestor.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId, userSecret } = req.method === 'GET' ? req.query : req.body;

  if (!userId || !userSecret) {
    return res.status(400).json({ error: 'Missing userId or userSecret' });
  }

  const clientId = 'THE-APEX-INVESTOR-TEST-LCWOQ';
  const clientSecret = 'N4ZHTCrbDRlaMdCrvWdStY8lgMMjy3mT7Jnr3x2MJROMjr7RkX';

  try {
    const snapRes = await fetch(
      `https://api.snaptrade.com/api/v1/snapTrade/connectionPortal?userId=${userId}&userSecret=${userSecret}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Client-Id': clientId,
          'X-Client-Secret': clientSecret
        }
      }
    );

    const raw = await snapRes.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ error: 'SnapTrade returned non-JSON response', raw });
    }

    if (snapRes.ok && data.redirectURI) {
      return res.status(200).json({ url: data.redirectURI });
    } else {
      return res.status(400).json({ error: data.error || 'No redirect URI returned', raw });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
