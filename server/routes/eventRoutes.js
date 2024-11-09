const express = require('express');
const { selectAll, createEvent } = require('../services/eventService'); // Use require
const router = express.Router();

// Endpoint to create a new event
router.post('/', createEvent);

// Endpoint to retrieve all events
router.get('/', selectAll);

module.exports = router;
