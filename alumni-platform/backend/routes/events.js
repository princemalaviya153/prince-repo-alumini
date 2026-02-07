const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.post('/', auth, eventController.createEvent);
router.get('/', auth, eventController.getEvents);
router.put('/:id/register', auth, eventController.registerEvent);
router.get('/:id/attendees', auth, eventController.getEventAttendees);

router.get('/pending', auth, eventController.getPendingEvents); // Place before /:id to avoid conflict
router.put('/:id/approve', auth, eventController.approveEvent);
router.put('/:id/reject', auth, eventController.rejectEvent);

module.exports = router;
