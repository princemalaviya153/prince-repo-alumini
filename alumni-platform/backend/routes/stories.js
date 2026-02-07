const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const storyController = require('../controllers/storyController');

router.post('/', auth, storyController.createStory);
router.get('/', auth, storyController.getStories);

module.exports = router;
