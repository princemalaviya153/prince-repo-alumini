const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.post('/', auth, eventController.createEvent);
router.get('/', auth, eventController.getEvents);
router.put('/:id/register', auth, eventController.registerEvent);

module.exports = router;
