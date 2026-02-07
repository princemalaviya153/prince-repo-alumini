const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Utilities
const login = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        return res.data.token;
    } catch (err) {
        console.error(`Login failed for ${email}:`, err.response?.data?.message || err.message);
        throw err;
    }
};

const register = async (name, email, password, role) => {
    try {
        await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
        console.log(`Registered ${role}: ${email}`);
    } catch (err) {
        if (err.response?.status === 400) {
            console.log(`User ${email} already exists, skipping registration.`);
        } else {
            console.error(`Registration failed for ${email}:`, err.message);
        }
    }
};

const runVerification = async () => {
    try {
        console.log("Starting Mentorship Verification...");

        // 1. Setup Users
        const mentorEmail = 'mentor_v3@test.com';
        const menteeEmail = 'mentee_v3@test.com';
        const password = 'password123';

        await register('Test Mentor V3', mentorEmail, password, 'alumni');
        await register('Test Mentee V3', menteeEmail, password, 'student');

        // 2. Login as Mentor and Update Profile
        console.log("\nLogging in as Mentor...");
        const mentorToken = await login(mentorEmail, password);

        console.log("Updating Mentor Profile...");

        try {
            await axios.put(`${API_URL}/profile`, {
                isMentor: true,
                mentorshipFocus: ['Career Advice', 'Coding'],
                mentorshipBio: "I am a test mentor V3."
            }, {
                headers: { Authorization: `Bearer ${mentorToken}` }
            });
            console.log("Mentor profile updated successfully.");
        } catch (err) {
            console.error("Mentor profile update failed:", err.message);
            if (err.response) console.error(err.response.data);
            return;
        }

        // 3. Login as Mentee and Find Mentor
        console.log("\nLogging in as Mentee...");
        const menteeToken = await login(menteeEmail, password);

        console.log("Searching for mentors...");
        const mentorsRes = await axios.get(`${API_URL}/mentorship/mentors`, {
            headers: { Authorization: `Bearer ${menteeToken}` }
        });

        const mentor = mentorsRes.data.find(m => m.email === mentorEmail);
        if (!mentor) {
            console.error("Test Mentor not found in search results!");
            console.log("Found mentors:", mentorsRes.data.map(m => m.email));
            return;
        }
        console.log(`Found Mentor: ${mentor.name} (${mentor._id})`);

        // 4. Send Request
        console.log("Sending Mentorship Request...");
        try {
            await axios.post(`${API_URL}/mentorship/request`, {
                mentorId: mentor._id,
                message: "Please mentor me!",
                goals: ["Learn Backend"]
            }, {
                headers: { Authorization: `Bearer ${menteeToken}` }
            });
            console.log("Request Sent.");
        } catch (err) {
            if (err.response?.data?.message?.includes('already have a pending request')) {
                console.log("Request already pending.");
            } else {
                console.error("Request failed:", err.message);
                if (err.response) console.error(err.response.data);
                throw err;
            }
        }

        // 5. Mentor Accepts Request
        console.log("\nMentor Accepting Request...");
        // Get Requests
        const requestsRes = await axios.get(`${API_URL}/mentorship/my-requests`, {
            headers: { Authorization: `Bearer ${mentorToken}` }
        });

        const request = requestsRes.data.asMentor.find(r => r.mentee.email === menteeEmail && r.status === 'pending');
        if (!request) {
            console.log("No pending request found (maybe already accepted?).");
            console.log("Current requests:", requestsRes.data.asMentor.map(r => `${r.mentee.email}: ${r.status}`));
        } else {
            console.log(`Found pending request: ${request._id}`);
            await axios.put(`${API_URL}/mentorship/request/${request._id}`, {
                status: 'accepted',
                responseMessage: "Sure, let's do it!"
            }, {
                headers: { Authorization: `Bearer ${mentorToken}` }
            });
            console.log("Request Accepted.");
        }

        console.log("\nVERIFICATION SUCCESSFUL: Full Flow Complete.");

    } catch (err) {
        console.error("\nVERIFICATION FAILED:", err.message);
        if (err.response) console.error("Data:", err.response.data);
    }
};

runVerification();
