const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = 'c82ccabdbd84436e828bde3b50ebe551';

app.get('/bot', async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).send('Missing name');

  try {
    const statsRes = await fetch(`https://api.donutsmp.net/v1/stats/${name}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const stats = await statsRes.json();

    const locRes = await fetch(`https://api.donutsmp.net/v1/findplayer/${name}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const location = await locRes.json();

    res.set('Access-Control-Allow-Origin', '*');
    res.json({ stats: JSON.parse(stats.result), location });
  } catch (err) {
    console.error("Fehler beim API-Aufruf:", err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));