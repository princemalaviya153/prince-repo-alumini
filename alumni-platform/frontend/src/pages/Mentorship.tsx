import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Briefcase, UserCheck, MessageSquare, Settings, CheckCircle, XCircle } from 'lucide-react';

const Mentorship = () => {
    const { user, updateUser } = useContext(AuthContext) || {}; // Added updateUser
    const [activeTab, setActiveTab] = useState('find'); // find, requests, settings
    const [mentors, setMentors] = useState<any[]>([]);
    const [myRequests, setMyRequests] = useState<{ asMentee: any[], asMentor: any[] }>({ asMentee: [], asMentor: [] });
    const [loading, setLoading] = useState(false);

    // settings state
    const [isMentor, setIsMentor] = useState(false);
    const [focus, setFocus] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (activeTab === 'find') fetchMentors();
        if (activeTab === 'requests') fetchMyRequests();
        if (activeTab === 'settings' && user) {
            setIsMentor(user.isMentor || false);
            setFocus(user.mentorshipFocus ? user.mentorshipFocus.join(', ') : '');
            setBio(user.mentorshipBio || '');
        }
    }, [activeTab, user]);

    const fetchMentors = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/mentorship/mentors');
            setMentors(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/mentorship/my-requests');
            setMyRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestMentorship = async (mentorId: string) => {
        const message = prompt("Why do you want to connect?");
        if (!message) return;

        try {
            await axios.post('http://localhost:5000/api/mentorship/request', { mentorId, message });
            alert("Request sent!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to send request");
        }
    };

    const handleUpdateStatus = async (requestId: string, status: string) => {
        try {
            await axios.put(`http://localhost:5000/api/mentorship/request/${requestId}`, { status });
            fetchMyRequests(); // Refresh
        } catch (err) {
            console.error(err);
        }
    };

    const saveSettings = async () => {
        try {
            const focusArray = focus.split(',').map(s => s.trim()).filter(s => s);
            // We need an endpoint to update user profile specifically for mentorship or reuse profile update
            // Reusing profile update endpoint if it supports these fields, otherwise create new one.
            // Assuming profile update supports these based on schema change. 
            // NOTE: We need to verify if profile update in Profile.tsx handles these.
            // Actually, Profile.tsx filtered specific fields. We might need a direct call here.

            // Let's use the profile usage pattern but with new fields. 
            // Since Profile.tsx uses FormData, we might need adjustments there OR use a json endpoint.
            // The existing backend/controllers/profile.js expects specific fields? No, it usually takes body.
            // Let's check backend/routes/profile.js later. For now assuming /api/profile works for partial updates if logic allows.

            // Wait, Profile.tsx sends FormData. Backend likely parses it.
            // Let's assume we can send JSON to /api/users/update-mentorship (Need to create this? Or use Profile put?)

            // Let's make a quick specialized endpoint or just try PUT /api/profile with JSON if Multer allows.
            // Usually Multer middleware handles multipart, but might skip JSON body if not multipart.

            // Safer bet: Add a specific route for mentorship settings in backend or use axios.put('/api/profile') with JSON and see if backend handles it.
            // Checking Profile.tsx, it uses `upload.single('profilePhoto')` middleware. 

            // Let's add a specific function for this in frontend to keep it clean.
            // Actually, let's use a new route `PUT /api/users/me` or similar? 
            // Let's stick to modifying the User model via a new simple route in mentorshipController for settings.

            // Updated plan: Add `updateSettings` to mentorshipController.
            const res = await axios.put('http://localhost:5000/api/profile', {
                isMentor,
                mentorshipFocus: focusArray,
                mentorshipBio: bio
            });
            // We'll need to make sure backend handles JSON.

            if (updateUser) updateUser(res.data); // Update context
            alert("Settings saved!");

        } catch (err) {
            console.error(err);
            alert("Failed to save settings");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Mentorship Program</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('find')} className={`${activeTab === 'find' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}>
                        Find a Mentor
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={`${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}>
                        My Requests
                    </button>
                    {user?.role === 'alumni' && (
                        <button onClick={() => setActiveTab('settings')} className={`${activeTab === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}>
                            Mentorship Settings
                        </button>
                    )}
                </nav>
            </div>

            {/* Find Mentors */}
            {activeTab === 'find' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map(mentor => (
                        <div key={mentor._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-4">
                                <img src={mentor.profilePhoto || "https://uia-avatars.com/api/?name=" + mentor.name} className="h-12 w-12 rounded-full mr-4" />
                                <div>
                                    <h3 className="font-bold">{mentor.name}</h3>
                                    <p className="text-sm text-gray-500">{mentor.currentPosition} at {mentor.company}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{mentor.mentorshipBio}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {mentor.mentorshipFocus?.map((f: string) => (
                                    <span key={f} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{f}</span>
                                ))}
                            </div>
                            <button
                                onClick={() => handleRequestMentorship(mentor._id)}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                Request Mentorship
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* My Requests */}
            {activeTab === 'requests' && (
                <div className="space-y-6">
                    {/* Incoming Requests (For Mentors) */}
                    {myRequests.asMentor.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Incoming Requests</h3>
                            {myRequests.asMentor.map(req => (
                                <div key={req._id} className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{req.mentee.name}</p>
                                        <p className="text-sm text-gray-600">{req.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">Status: <span className={`font-semibold ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span></p>
                                        {req.status === 'accepted' && (
                                            <div className="mt-2 text-sm bg-green-50 p-2 rounded border border-green-200">
                                                <p className="font-semibold text-green-800">Contact Details:</p>
                                                <p>Email: {req.mentee.email}</p>
                                                <p>Phone: {req.mentee.phone || 'N/A'}</p>
                                            </div>
                                        )}
                                    </div>
                                    {req.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleUpdateStatus(req._id, 'accepted')} className="text-green-600 hover:bg-green-50 p-2 rounded"><CheckCircle /></button>
                                            <button onClick={() => handleUpdateStatus(req._id, 'rejected')} className="text-red-600 hover:bg-red-50 p-2 rounded"><XCircle /></button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Outgoing Requests (For Mentees) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">My Mentorship Applications</h3>
                        {myRequests.asMentee.map(req => (
                            <div key={req._id} className="bg-white p-4 rounded-lg shadow mb-3">
                                <p className="font-bold">Mentor: {req.mentor.name}</p>
                                <p className="text-sm text-gray-600">My Message: {req.message}</p>
                                <p className="text-xs text-gray-500 mt-1">Status: <span className={`font-semibold ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span></p>

                                {req.status === 'accepted' && (
                                    <div className="mt-2 text-sm bg-green-50 p-2 rounded border border-green-200">
                                        <p className="font-semibold text-green-800">Contact Details:</p>
                                        <p>Email: {req.mentor.email}</p>
                                        <p>Phone: {req.mentor.phone || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Settings (Alumni Only) */}
            {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="isMentor"
                            checked={isMentor}
                            onChange={(e) => setIsMentor(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isMentor" className="ml-2 block text-sm text-gray-900 font-bold">
                            Available to Mentor
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mentorship Focus (comma separated)</label>
                        <input
                            type="text"
                            value={focus}
                            onChange={(e) => setFocus(e.target.value)}
                            placeholder="e.g. Career Advice, Resume Review, Mock Interview"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mentorship Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <button
                        onClick={saveSettings}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Save Settings
                    </button>
                </div>
            )}
        </div>
    );
};

export default Mentorship;
