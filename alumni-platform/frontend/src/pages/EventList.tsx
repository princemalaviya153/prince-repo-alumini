import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EventList = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any>(null); // For View Attendees modal
    const [showAttendees, setShowAttendees] = useState(false);

    const auth = useContext(AuthContext);
    const user = auth?.user;

    const [pendingEvents, setPendingEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data);

                if (user?.role === 'admin') {
                    const pendingResponse = await axios.get('http://localhost:5000/api/events/pending');
                    setPendingEvents(pendingResponse.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [user]);

    const handleApprove = async (eventId: string) => {
        try {
            await axios.put(`http://localhost:5000/api/events/${eventId}/approve`);
            alert('Event Approved!');
            // Refresh
            const pendingResponse = await axios.get('http://localhost:5000/api/events/pending');
            setPendingEvents(pendingResponse.data);
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data);
        } catch (err) {
            console.error(err);
            alert('Failed to approve event');
        }
    };

    const handleReject = async (eventId: string) => {
        if (!window.confirm('Are you sure you want to reject this event?')) return;
        try {
            await axios.put(`http://localhost:5000/api/events/${eventId}/reject`);
            alert('Event Rejected!');
            // Refresh
            const pendingResponse = await axios.get('http://localhost:5000/api/events/pending');
            setPendingEvents(pendingResponse.data);
        } catch (err) {
            console.error(err);
            alert('Failed to reject event');
        }
    };

    const handleRegister = async (eventId: string) => {
        try {
            await axios.put(`http://localhost:5000/api/events/${eventId}/register`);
            alert('Successfully registered!');
            // Refresh events
            const response = await axios.get('http://localhost:5000/api/events');
            setEvents(response.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleViewAttendees = async (event: any) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/events/${event._id}/attendees`);
            setSelectedEvent({ ...event, attendeesDetails: response.data });
            setShowAttendees(true);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch attendees');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
                {user?.role !== 'student' && (
                    <Link to="/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Create Event
                    </Link>
                )}
            </div>

            {user?.role === 'admin' && pendingEvents.length > 0 && (
                <div className="mb-12 border-b pb-8">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4">Pending Approvals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingEvents.map(event => (
                            <div key={event._id} className="bg-orange-50 border border-orange-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">Requested by: <span className="font-medium">{event.createdBy?.name}</span></p>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                    <div className="mt-auto flex space-x-3">
                                        <button
                                            onClick={() => handleApprove(event._id)}
                                            className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(event._id)}
                                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm font-medium"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading ? <div className="text-center py-10">Loading events...</div> :
                events.length === 0 ? <div className="text-center py-10 text-gray-500">No upcoming events.</div> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                                {event.bannerImage && (
                                    <img src={event.bannerImage} alt={event.title} className="h-48 w-full object-cover" />
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {event.eventType}
                                        </span>
                                        <span className={`text-xs font-medium ${event.status === 'upcoming' ? 'text-green-600' : 'text-gray-500'}`}>
                                            {event.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{event.description}</p>

                                    <div className="space-y-2 text-sm text-gray-500 mt-auto">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{new Date(event.dateTime).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>{event.currentAttendees.length} / {event.maxAttendees || 'Unlimited'} attending</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t space-y-2">
                                        {/* View Attendees Button for Coordinators */}
                                        {(user?.role === 'admin' || user?.role === 'event_coordinator') && (
                                            <button
                                                onClick={() => handleViewAttendees(event)}
                                                className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
                                            >
                                                View Attendees ({event.currentAttendees.length})
                                            </button>
                                        )}

                                        {event.currentAttendees.includes(user?.id) ? (
                                            <button disabled className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium cursor-default">
                                                Registered
                                            </button>
                                        ) : (
                                            user?.role !== 'event_coordinator' && user?.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleRegister(event._id)}
                                                    className="w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                                                >
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Register Now
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}

            {/* Attendees Modal */}
            {showAttendees && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Attendees for {selectedEvent.title}</h2>
                            <button onClick={() => setShowAttendees(false)} className="text-gray-500 hover:text-gray-700">Close</button>
                        </div>
                        {selectedEvent.attendeesDetails?.length === 0 ? (
                            <p className="text-gray-500">No attendees yet.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {selectedEvent.attendeesDetails?.map((attendee: any) => (
                                    <li key={attendee._id || attendee.id} className="py-3 flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                            {attendee.profilePhoto ? (
                                                <img src={attendee.profilePhoto} alt={attendee.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="flex items-center justify-center h-full w-full text-gray-500 font-bold">
                                                    {attendee.name.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{attendee.name}</p>
                                            <p className="text-sm text-gray-500">{attendee.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button onClick={() => setShowAttendees(false)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventList;
