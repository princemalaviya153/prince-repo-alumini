const Event = require('../models/Event');

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event({
            ...req.body,
            createdBy: req.user.userId
        });
        const event = await newEvent.save();
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
        const events = await Event.find().sort({ dateTime: 1 });
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
