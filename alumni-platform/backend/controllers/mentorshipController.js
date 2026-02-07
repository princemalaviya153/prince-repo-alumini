const User = require('../models/User');
const MentorshipRequest = require('../models/MentorshipRequest');

// Get all mentors with filters
exports.getMentors = async (req, res) => {
    try {
        const { industry, name, focus } = req.query;
        let query = { isMentor: true };

        if (industry) query.industry = industry;
        if (name) query.name = { $regex: name, $options: 'i' };
        // if (focus) query.mentorshipFocus = { $in: [focus] }; // Simple match

        const mentors = await User.find(query)
            .select('name email profilePhoto currentPosition company industry location mentorshipFocus mentorshipBio preferredMentorshipMode')
            .limit(20); // Pagination later

        res.json(mentors);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Send Mentorship Request
exports.sendRequest = async (req, res) => {
    try {
        const { mentorId, message, goals } = req.body;
        const menteeId = req.user.userId; // From auth middleware

        if (mentorId === menteeId) {
            return res.status(400).json({ message: "You cannot request mentorship from yourself." });
        }

        const mentor = await User.findById(mentorId);
        if (!mentor || !mentor.isMentor) {
            return res.status(404).json({ message: "Mentor not found or is not accepting mentees." });
        }

        // Check for existing pending request
        const existingRequest = await MentorshipRequest.findOne({
            mentor: mentorId,
            mentee: menteeId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending request with this mentor." });
        }

        const newRequest = new MentorshipRequest({
            mentor: mentorId,
            mentee: menteeId,
            message,
            goals
        });

        await newRequest.save();
        res.status(201).json(newRequest);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Update Request Status (Accept/Reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, responseMessage } = req.body;
        const userId = req.user.userId;

        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Check ownership (Only the mentor can accept/reject, Mentee can cancel)
        if (request.mentor.toString() !== userId && request.mentee.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (request.mentor.toString() === userId) {
            // Mentor Actions
            if (!['accepted', 'rejected'].includes(status)) {
                return res.status(400).json({ message: "Invalid status update for mentor" });
            }
        } else {
            // Mentee Actions
            if (status !== 'cancelled') {
                return res.status(400).json({ message: "Mentees can only cancel requests" });
            }
        }

        request.status = status;
        if (responseMessage) request.responseMessage = responseMessage;

        await request.save();
        res.json(request);

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get My Requests (As Mentor and Mentee)
exports.getMyRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const asMentee = await MentorshipRequest.find({ mentee: userId })
            .populate('mentor', 'name email phone profilePhoto currentPosition company')
            .sort({ createdAt: -1 });

        const asMentor = await MentorshipRequest.find({ mentor: userId })
            .populate('mentee', 'name email phone profilePhoto currentPosition company industry') // Show mentee details
            .sort({ createdAt: -1 });

        res.json({ asMentee, asMentor });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
