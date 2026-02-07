require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MentorshipRequest = require('./models/MentorshipRequest');

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // identifying test users
        const testEmailPattern = /test/i;
        // Also capture the specific ones we created
        const specificLink = /^(mentor|mentee)_/i;

        const usersToDelete = await User.find({
            $or: [
                { email: testEmailPattern },
                { email: specificLink }
            ]
        });

        if (usersToDelete.length === 0) {
            console.log('No test users found.');
            process.exit(0);
        }

        console.log(`Found ${usersToDelete.length} users to delete.`);
        const userIds = usersToDelete.map(u => u._id);

        // Delete Mentorship Requests involving these users
        const deletedRequests = await MentorshipRequest.deleteMany({
            $or: [
                { mentor: { $in: userIds } },
                { mentee: { $in: userIds } }
            ]
        });
        console.log(`Deleted ${deletedRequests.deletedCount} mentorship requests.`);

        // Delete Users
        const deletedUsers = await User.deleteMany({ _id: { $in: userIds } });
        console.log(`Deleted ${deletedUsers.deletedCount} users.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanup();
