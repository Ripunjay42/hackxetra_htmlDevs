const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
// Enable CORS for your frontend domain (e.g., localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: 'GET, POST, PUT, DELETE',  // Allow certain HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow certain headers
  }));

app.use(express.json());
app.use('/api/auth', authRoutes);


module.exports = app;
