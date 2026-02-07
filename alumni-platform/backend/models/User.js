const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['alumni', 'admin'], default: 'alumni' },

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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
