const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    donorName: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'Mock Payment' },
    receiptNumber: { type: String, unique: true },
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
