const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);

module.exports = app;
