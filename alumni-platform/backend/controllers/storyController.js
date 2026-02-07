const SuccessStory = require('../models/SuccessStory');

// Create Story
exports.createStory = async (req, res) => {
    try {
        const newStory = new SuccessStory({
            ...req.body,
            submittedBy: req.user.userId
        });
        const story = await newStory.save();
        res.json(story);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Stories
exports.getStories = async (req, res) => {
    try {
        const stories = await SuccessStory.find({ approved: true }).sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
