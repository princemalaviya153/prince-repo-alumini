const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    message: { // Initial message from mentee
        type: String,
        required: true
    },
    responseMessage: String, // Optional response from mentor
    goals: [String], // Initial goals if any
}, { timestamps: true });

// Ensure a mentee can only have one pending request to a specific mentor
mentorshipRequestSchema.index({ mentor: 1, mentee: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
