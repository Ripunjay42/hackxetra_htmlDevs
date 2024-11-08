// server/routes/authRoutes.js
const express = require('express');
const { registerUser, checkUserExists } = require('../controllers/authController');
const router = express.Router();

// Endpoint to register a new user
router.post('/signup', registerUser); 

// Endpoint to check if the user exists by email
router.get('/user/:email', checkUserExists);

module.exports = router;
