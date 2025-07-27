// /api/register-user.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientId = 'API-THE-APEX-INVESTOR-HGGAU';
  const clientSecret = '4ILnH7k8kmAeKerCAAQ6W6IPUPPn4a0pohW9qTE12L32g4Sx8f';

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  try {
    const response = await fetch('https://api.snaptrade.com/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': clientId,
        'X-Client-Secret': clientSecret
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'User registered', data });
    } else {
      return res.status(400).json({ error: data.error || 'User registration failed', details: data });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
