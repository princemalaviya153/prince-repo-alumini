const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    alumniName: { type: String, required: true },
    graduationYear: Number,
    currentPosition: String,
    achievementTitle: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Career', 'Innovation', 'Research', 'Social Impact', 'Sports'], default: 'Career' },
    photo: String,
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: true }, // Auto-approve for hackathon
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', storySchema);
