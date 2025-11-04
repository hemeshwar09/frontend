const express = require('express');
const router = express.Router();
const UserPreference = require('../models/UserPreference');

// POST /api/preferences  { city, country?, units?, userId? }
router.post('/', async (req, res) => {
  try {
    const { city, country, units, userId } = req.body;
    if (!city) return res.status(400).json({ error: 'city is required' });
    const pref = new UserPreference({ city, country, units, userId });
    await pref.save();
    res.status(201).json(pref);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/preferences?userId=123
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const prefs = await UserPreference.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(prefs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/preferences/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await UserPreference.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
