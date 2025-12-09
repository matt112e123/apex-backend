export default async function handler(req, res) {
  const cloudRunUrl = 'https://schwaboauthcallback-62z65y7jiq-uc.a.run.app/oauth/callback/schwab';
  let forwardUrl = cloudRunUrl;
  if (req.url.includes('?')) forwardUrl += req.url.substring(req.url.indexOf('?'));
  const response = await fetch(forwardUrl, { method: req.method });
  const text = await response.text();
  res.status(response.status).send(text);
}
