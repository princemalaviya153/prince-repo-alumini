const Donation = require('../models/Donation');
const crypto = require('crypto');

// Process Donation
exports.createDonation = async (req, res) => {
    try {
        const { amount, purpose, donorName, isAnonymous } = req.body;

        // Generate Mock Receipt ID
        const receiptNumber = 'RCPT-' + crypto.randomBytes(4).toString('hex').toUpperCase();

        const newDonation = new Donation({
            amount,
            purpose,
            donorName,
            isAnonymous,
            receiptNumber,
            donatedBy: req.user.userId,
            status: 'completed' // Mock success
        });

        const donation = await newDonation.save();
        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Donations (for stats)
exports.getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().sort({ createdAt: -1 });
        // Mask donor name if anonymous
        const publicDonations = donations.map(d => ({
            ...d._doc,
            donorName: d.isAnonymous ? 'Anonymous' : d.donorName
        }));
        res.json(publicDonations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
