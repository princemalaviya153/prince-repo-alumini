const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['alumni', 'admin', 'student', 'event_coordinator'], default: 'alumni' },

    // Profile Fields
    phone: String,
    profilePhoto: String,
    graduationYear: Number,
    degree: String,
    fieldOfStudy: String,
    studentId: String,

    currentPosition: String,
    company: String,
    industry: String,
    location: String,

    bio: String,
    linkedIn: String,
    skills: [String],

    isProfileComplete: { type: Boolean, default: false },

    // Mentorship Fields
    isMentor: { type: Boolean, default: false },
    mentorshipFocus: [String], // e.g., "Career Guidance", "Resume Review"
    mentorshipCapacity: { type: Number, default: 1 },
    mentorshipBio: String,
    preferredMentorshipMode: { type: String, enum: ['virtual', 'in-person', 'both'], default: 'virtual' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
