const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const TOKEN = 'c82ccabdbd84436e828bde3b50ebe551';

app.get('/bot', async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).send('Missing name');

  try {
    // 🟡 1. STATS
    const statsRes = await fetch(`https://api.donutsmp.net/v1/stats/${name}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    if (!statsRes.ok) {
      const msg = await statsRes.text();
      throw new Error(`Stats API returned ${statsRes.status}: ${msg}`);
    }

    const statsJson = await statsRes.json();
    const stats = JSON.parse(statsJson.result);

    // 🟡 2. LOCATION
    const locRes = await fetch(`https://api.donutsmp.net/v1/findplayer/${name}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    if (!locRes.ok) {
      const msg = await locRes.text();
      throw new Error(`Location API returned ${locRes.status}: ${msg}`);
    }

    const location = await locRes.json();

    // ✅ Erfolgreich
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ stats, location });

  } catch (err) {
    console.error("Fehler beim API-Aufruf:", err.message);
    res.status(500).send('Error fetching data: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});