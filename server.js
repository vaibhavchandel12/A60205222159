const express = require('express');
const cors = require('cors');
const app = express();
const loggingMiddleware = require('./loggingMiddleware');

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware); // ✅ Logs every request

const urls = new Map(); // shortCode -> { longUrl, expiryTime }

app.post('/api/shorten', (req, res) => {
  const { longUrl, customCode, validity } = req.body;

  let shortCode = customCode?.trim() || Math.random().toString(36).substring(2, 8);

  // Check if customCode is already taken
  if (customCode && urls.has(shortCode)) {
    return res.status(400).json({ error: 'Custom shortcode already in use' });
  }

  // Optional expiry logic (validity in minutes)
  const expiryTime = validity ? Date.now() + validity * 60 * 1000 : null;

  urls.set(shortCode, { longUrl, expiryTime });

  res.json({ shortUrl: `http://localhost:5000/${shortCode}` });
});

app.get('/:code', (req, res) => {
  const entry = urls.get(req.params.code);
  if (!entry) return res.status(404).send('URL not found');

  const { longUrl, expiryTime } = entry;

  // Check expiration
  if (expiryTime && Date.now() > expiryTime) {
    urls.delete(req.params.code);
    return res.status(410).send('URL has expired');
  }

  res.redirect(longUrl);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
