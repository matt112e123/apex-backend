const express = require('express');
const app = express();

app.get('/oauth/callback/schwab', (req, res) => {
  const code = req.query.code;
  console.log("Schwab Callback HIT!", code);

  if (!code) {
    return res.status(400).send('Missing code parameter from Schwab.');
  }

  // Place your token exchange logic here later...

  res.send('Schwab account linked! You may now return to the app.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server listening on port', port);
});
