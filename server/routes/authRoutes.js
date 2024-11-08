const express = require('express');
const { registerUser, checkUserExists, getAllUserIds } = require('../controllers/authController');
const router = express.Router();

// Endpoint to register a new user
router.post('/signup', registerUser);

// Endpoint to check if the user exists by email
router.get('/user/:email', checkUserExists);

// Endpoint to get all user ids and first names
router.get('/users', getAllUserIds);


module.exports = router;
