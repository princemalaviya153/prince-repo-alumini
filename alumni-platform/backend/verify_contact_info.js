const API_URL = 'http://localhost:5000/api';

const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.token;
};

const register = async (name, email, password, role) => {
    await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
    });
};

const runVerification = async () => {
    try {
        console.log("Starting Contact Info Verification...");
        const uniqueId = Date.now();
        const mentorEmail = `mentor_contact_${uniqueId}@test.com`;
        const menteeEmail = `mentee_contact_${uniqueId}@charusat.edu.in`;
        const password = 'password123';

        await register(`Mentor Contact ${uniqueId}`, mentorEmail, password, 'alumni');
        await register(`Mentee Contact ${uniqueId}`, menteeEmail, password, 'student');

        const mentorToken = await login(mentorEmail, password);
        const menteeToken = await login(menteeEmail, password);

        // Mentor enables mentorship
        await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mentorToken}`
            },
            body: JSON.stringify({ isMentor: true })
        });

        // Get Mentor ID
        const mentorsRes = await fetch(`${API_URL}/mentorship/mentors`, {
            headers: { 'Authorization': `Bearer ${menteeToken}` }
        });
        const mentors = await mentorsRes.json();
        const mentor = mentors.find(m => m.email === mentorEmail);

        // Send Request
        const reqRes = await fetch(`${API_URL}/mentorship/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${menteeToken}`
            },
            body: JSON.stringify({ mentorId: mentor._id, message: "Contact test", goals: [] })
        });
        const reqData = await reqRes.json();

        // Accept Request
        await fetch(`${API_URL}/mentorship/request/${reqData._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mentorToken}`
            },
            body: JSON.stringify({ status: 'accepted' })
        });

        // Verify Mentee sees Mentor's Email
        const myRequestsMenteeRes = await fetch(`${API_URL}/mentorship/my-requests`, {
            headers: { 'Authorization': `Bearer ${menteeToken}` }
        });
        const myRequestsMentee = await myRequestsMenteeRes.json();
        const acceptedReqMentee = myRequestsMentee.asMentee.find(r => r._id === reqData._id);

        if (acceptedReqMentee.mentor.email && acceptedReqMentee.status === 'accepted') {
            console.log("✅ Mentee sees Mentor Email:", acceptedReqMentee.mentor.email);
        } else {
            console.error("❌ Mentee CANNOT see Mentor Email", acceptedReqMentee.mentor);
        }

        // Verify Mentor sees Mentee's Email
        const myRequestsMentorRes = await fetch(`${API_URL}/mentorship/my-requests`, {
            headers: { 'Authorization': `Bearer ${mentorToken}` }
        });
        const myRequestsMentor = await myRequestsMentorRes.json();
        const acceptedReqMentor = myRequestsMentor.asMentor.find(r => r._id === reqData._id);

        if (acceptedReqMentor.mentee.email && acceptedReqMentor.status === 'accepted') {
            console.log("✅ Mentor sees Mentee Email:", acceptedReqMentor.mentee.email);
        } else {
            console.error("❌ Mentor CANNOT see Mentee Email", acceptedReqMentor.mentee);
        }

    } catch (err) {
        console.error("Verification Failed:", err);
    }
};

runVerification();
