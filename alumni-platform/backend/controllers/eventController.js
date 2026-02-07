const Event = require('../models/Event');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { role } = req.user;
        const status = role === 'alumni' ? 'pending' : 'upcoming';

        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.userId,
            status
        });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Pending Events (Admin only)
exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).sort({ createdAt: -1 }).populate('createdBy', 'name email');
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Approve Event
exports.approveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = 'upcoming';
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Reject Event
exports.rejectEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.status = 'rejected';
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get All Events
exports.getEvents = async (req, res) => {
    try {
        // Basic status logic based on date
        // Note: status field in model might be redundant if we just compare dates dynamically,
        // but useful for explicit archiving.
        // Show only upcoming and past events (approved)
        const events = await Event.find({ status: { $in: ['upcoming', 'past'] } }).sort({ dateTime: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Register for Event
exports.registerEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.currentAttendees.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        if (event.maxAttendees && event.currentAttendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event full' });
        }

        event.currentAttendees.push(req.user.userId);
        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get Event Attendees
exports.getEventAttendees = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('currentAttendees', 'name email profilePhoto');
        if (!event) return res.status(404).json({ message: 'Event not found' });

        res.json(event.currentAttendees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
