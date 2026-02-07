const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mentorshipController = require('../controllers/mentorshipController');

/**
 * @route   GET /api/mentorship/mentors
 * @desc    Get all mentors
 * @access  Private
 */
router.get('/mentors', auth, mentorshipController.getMentors);

/**
 * @route   POST /api/mentorship/request
 * @desc    Send a mentorship request
 * @access  Private
 */
router.post('/request', auth, mentorshipController.sendRequest);

/**
 * @route   PUT /api/mentorship/request/:requestId
 * @desc    Update request status (Accept/Reject)
 * @access  Private
 */
router.put('/request/:requestId', auth, mentorshipController.updateRequestStatus);

/**
 * @route   GET /api/mentorship/my-requests
 * @desc    Get my mentorship requests (as mentor and mentee)
 * @access  Private
 */
router.get('/my-requests', auth, mentorshipController.getMyRequests);

module.exports = router;
