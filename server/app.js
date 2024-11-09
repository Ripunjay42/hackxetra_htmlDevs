const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const streamRoutes = require('./routes/streamRoutes');
const clubRoutes  = require("./routes/clubRoutes")
const gropuRoutes = require("./routes/groupRoutes")
const eventRoutes = require("./routes/eventRoutes");

// Enable CORS for your frontend domain (e.g., localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: 'GET, POST, PUT, DELETE',  // Allow certain HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'userid'], // Allow certain headers
  }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/clubs',clubRoutes);
app.use('/api/groups',gropuRoutes);
app.use('/api/event',eventRoutes)

module.exports = app;
