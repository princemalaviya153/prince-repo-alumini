const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get Current User Profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        const userObj = user.toObject();
        userObj.id = userObj._id;
        delete userObj._id;
        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const upload = require('../middleware/upload');

// Update Profile
router.put('/', auth, upload.single('profilePhoto'), async (req, res) => {
    console.log('Profile Update Body:', req.body);
    console.log('Profile Update File:', req.file);

    const {
        name, phone, graduationYear, degree, fieldOfStudy,
        studentId, currentPosition, company, industry, location,
        bio, linkedIn, skills
    } = req.body;

    const profileFields = {
        name, phone, graduationYear, degree, fieldOfStudy,
        studentId, currentPosition, company, industry, location,
        bio, linkedIn, skills,
        isProfileComplete: true
    };

    // If file uploaded, update profilePhoto path
    if (req.file) {
        profileFields.profilePhoto = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // Clean undefined fields
    Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

    try {
        let user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');

        const userObj = user.toObject();
        userObj.id = userObj._id;
        delete userObj._id;
        res.json(userObj);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
