const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const DATA_PATH = path.join(__dirname, '..', 'data', 'asian_countries.json');

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load countries data', err);
    return [];
  }
}

// GET /api/countries/asia
router.get('/asia', (req, res) => {
  const data = loadData();
  res.json(data);
});

// GET /api/countries/asia/:code  (iso2 code or name)
router.get('/asia/:key', (req, res) => {
  const { key } = req.params;
  const data = loadData();
  const found = data.find(c => c.iso2?.toLowerCase() === key.toLowerCase() || c.name?.toLowerCase() === key.toLowerCase());
  if (!found) return res.status(404).json({ message: 'Country not found' });
  res.json(found);
});

module.exports = router;
