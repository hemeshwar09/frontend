const express = require('express');
const Salon = require('../models/Salon');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const salons = await Salon.find().limit(50);
  res.json(salons);
});

router.get('/:id', async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) return res.status(404).json({ error: 'Not found' });
  res.json(salon);
});

router.post('/', auth, async (req, res) => {
  const { name, description, address, city, services } = req.body;
  const salon = await Salon.create({ name, description, address, city, services, owner: req.user.id });
  res.status(201).json(salon);
});

module.exports = router;
