const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    venue: { type: String, required: true },
    eventType: { type: String, enum: ['Reunion', 'Workshop', 'Seminar', 'Networking', 'Webinar'], default: 'Networking' },
    registrationLink: String,
    maxAttendees: Number,
    currentAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bannerImage: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
