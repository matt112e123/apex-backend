export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET' });
  }

  const { userId, userSecret } = req.query;

  if (!userId || !userSecret) {
    return res.status(400).json({ error: 'Missing userId or userSecret' });
  }

  const clientId = 'THE-APEX-INVESTOR-HGGAU';
  const clientSecret = '4ILnH7k8kmAeKerCAAQ6W6IPUPPn4a0pohW9qTE12L32g4Sx8f';

  try {
    const snapRes = await fetch(`https://api.snaptrade.com/api/v1/snapTrade/connectionPortal?userId=${encodeURIComponent(userId)}&userSecret=${encodeURIComponent(userSecret)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-SnapTrade-Client-Id': clientId,
        'X-SnapTrade-Client-Secret': clientSecret
      }
    });

    const raw = await snapRes.text();
    console.log('📄 SnapTrade raw response:', raw);

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
    console.error('❌ SnapTrade fetch error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
