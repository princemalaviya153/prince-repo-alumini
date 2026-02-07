const API_URL = 'http://localhost:5000/api';

// Utilities with fetch
const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message || res.statusText} (Status: ${res.status})`);
        return data.token;
    } catch (err) {
        console.error(`Login failed for ${email}:`, err.message);
        throw err;
    }
};

const register = async (name, email, password, role) => {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();
        if (!res.ok && res.status !== 400) throw new Error(`${data.message || res.statusText} (Status: ${res.status})`);

        if (res.status === 400 && data.message?.includes('already exists')) {
            console.log(`User ${email} already exists, skipping.`);
        } else if (res.ok) {
            console.log(`Registered ${role}: ${email}`);
        } else {
            console.log(`Registration failed for ${email}: ${data.message}`);
        }
    } catch (err) {
        console.error(`Registration failed for ${email}:`, err.message);
    }
};

const runVerification = async () => {
    try {
        console.log("Starting Mentorship Verification (Fetch + Unique Emails + Charusat)...");

        const uniqueId = Date.now();
        const mentorEmail = `mentor_${uniqueId}@test.com`;
        const menteeEmail = `mentee_${uniqueId}@charusat.edu.in`; // CORRECT DOMAIN
        const password = 'password123';

        await register(`Test Mentor ${uniqueId}`, mentorEmail, password, 'alumni');
        await register(`Test Mentee ${uniqueId}`, menteeEmail, password, 'student');

        // 2. Login Mentor
        console.log("\nLogging in as Mentor...");
        const mentorToken = await login(mentorEmail, password);

        console.log("Updating Mentor Profile...");
        const updateRes = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mentorToken}`
            },
            body: JSON.stringify({
                isMentor: true,
                mentorshipFocus: ['Native Fetch', 'Testing'],
                mentorshipBio: "I am a test mentor using fetch."
            })
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) {
            console.error("Profile update failed:", updateData);
            return;
        }
        console.log("Mentor profile updated successfully.");

        // 3. Login Mentee
        console.log("\nLogging in as Mentee...");
        const menteeToken = await login(menteeEmail, password);

        console.log("Searching for mentors...");
        const mentorsRes = await fetch(`${API_URL}/mentorship/mentors`, {
            headers: { 'Authorization': `Bearer ${menteeToken}` }
        });
        const mentors = await mentorsRes.json();

        const mentor = mentors.find(m => m.email === mentorEmail);
        if (!mentor) {
            console.error("Test Mentor not found!");
            return;
        }
        console.log(`Found Mentor: ${mentor.name}`);

        // 4. Send Request
        console.log("Sending Mentorship Request...");
        const reqRes = await fetch(`${API_URL}/mentorship/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${menteeToken}`
            },
            body: JSON.stringify({
                mentorId: mentor._id,
                message: "Please mentor me via fetch!",
                goals: ["Master Node"]
            })
        });
        const reqData = await reqRes.json();

        if (!reqRes.ok) {
            if (reqData.message?.includes('already have a pending request')) {
                console.log("Request already pending.");
            } else {
                throw new Error(reqData.message);
            }
        } else {
            console.log("Request Sent.");
        }

        // 5. Mentor Accepts
        console.log("\nMentor Accepting Request...");
        const myReqRes = await fetch(`${API_URL}/mentorship/my-requests`, {
            headers: { 'Authorization': `Bearer ${mentorToken}` }
        });
        const myReqs = await myReqRes.json();

        const request = myReqs.asMentor.find(r => r.mentee.email === menteeEmail && r.status === 'pending');
        if (!request) {
            console.log("No pending request found.");
        } else {
            console.log(`Found pending request: ${request._id}`);
            const acceptRes = await fetch(`${API_URL}/mentorship/request/${request._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mentorToken}`
                },
                body: JSON.stringify({
                    status: 'accepted',
                    responseMessage: "Accepted via fetch!"
                })
            });
            if (acceptRes.ok) console.log("Request Accepted.");
            else console.error("Accept failed:", await acceptRes.json());
        }

        console.log("\nVERIFICATION SUCCESSFUL: Full Flow Complete.");

    } catch (err) {
        console.error("\nVERIFICATION FAILED:", err.message);
    }
};

runVerification();
