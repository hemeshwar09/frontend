const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/weather/current?city=London&units=metric
router.get('/current', async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenWeather API key not configured' });

    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    } else {
      return res.status(400).json({ error: 'Provide city or lat & lon' });
    }

    const resp = await axios.get(url);
    return res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    return res.status(status).json({ error: data });
  }
});

// GET /api/weather/multiple?cities=London,Paris,Tokyo&units=metric
router.get('/multiple', async (req, res) => {
  try {
    const { cities, units = 'metric' } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenWeather API key not configured' });
    if (!cities) return res.status(400).json({ error: 'Provide cities parameter' });

    const cityList = cities.split(',');
    const weatherPromises = cityList.map(city => 
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=${units}&appid=${apiKey}`)
        .then(resp => resp.data)
        .catch(err => ({ error: true, city, message: err.response?.data?.message || err.message }))
    );

    const results = await Promise.all(weatherPromises);
    return res.json(results.filter(result => !result.error));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/weather/forecast?city=London&units=metric
router.get('/forecast', async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenWeather API key not configured' });

    let url;
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    } else {
      return res.status(400).json({ error: 'Provide city or lat & lon' });
    }

    const resp = await axios.get(url);
    return res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    return res.status(status).json({ error: data });
  }
});

module.exports = router;
