const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get All Alumni (Directory) with Search & Filters
router.get('/', auth, async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const { name, company, graduationYear, fieldOfStudy, industry, location, role, page = 1, limit = 10 } = req.query;

        let query = {};

        // Role Filter (Admin can view students, others only see alumni)
        if (req.user.role === 'admin' && role) {
            query.role = role;
        } else {
            query.role = 'alumni';
        }

        // Search (Case insensitive, partial match)
        if (name) query.name = { $regex: name, $options: 'i' };
        if (company) query.company = { $regex: company, $options: 'i' };
        if (fieldOfStudy) query.fieldOfStudy = { $regex: fieldOfStudy, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };

        // Filters (Exact match)
        if (graduationYear) query.graduationYear = graduationYear;
        if (industry) query.industry = industry;

        const users = await User.find(query)
            .select('-password')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ name: 1 });

        const total = await User.countDocuments(query);

        res.json({ users, total, pages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
