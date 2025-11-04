require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const weatherRoutes = require('./routes/weather');
const prefRoutes = require('./routes/preferences');
const authRoutes = require('./routes/auth');
const countriesRoutes = require('./routes/countries');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => res.json({message: 'Weatherly backend running'}));

app.use('/api/weather', weatherRoutes);
app.use('/api/preferences', prefRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/countries', countriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
