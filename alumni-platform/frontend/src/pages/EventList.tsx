import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EventList = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = useContext(AuthContext);
    const user = auth?.user;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                setEvents(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
                <Link to="/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Create Event
                </Link>
            </div>

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

                                    <div className="mt-6 pt-4 border-t">
                                        {event.currentAttendees.includes(user?.id) ? (
                                            <button disabled className="w-full bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium cursor-default">
                                                Registered
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRegister(event._id)}
                                                className="w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                                            >
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Register Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}
        </div>
    );
};

export default EventList;
