import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Briefcase, Calendar, Heart, ArrowRight } from 'lucide-react';

const Home = () => {
    const { user } = useContext(AuthContext) || {};
    const [stats, setStats] = useState({
        alumniCount: 0,
        jobCount: 0,
        eventCount: 0,
        donationTotal: 0
    });
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, jobsRes, eventsRes, donationsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users?limit=1'), // Just to get total count
                    axios.get('http://localhost:5000/api/jobs'),
                    axios.get('http://localhost:5000/api/events'),
                    axios.get('http://localhost:5000/api/donations')
                ]);

                const donationSum = donationsRes.data.reduce((acc: number, curr: any) => acc + curr.amount, 0);

                setStats({
                    alumniCount: usersRes.data.total,
                    jobCount: jobsRes.data.length,
                    eventCount: eventsRes.data.length,
                    donationTotal: donationSum
                });

                setRecentJobs(jobsRes.data.slice(0, 4));
                setUpcomingEvents(eventsRes.data.filter((e: any) => new Date(e.dateTime) > new Date()).slice(0, 3));

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-blue-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Your Alumni Community {user?.name ? `, ${user.name}` : ''}</h1>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Connect, Network, and Grow with fellow graduates. Your journey continues here.</p>
                    {!user && (
                        <div className="space-x-4">
                            <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">Join Network</Link>
                            <Link to="/login" className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition border border-blue-600">Sign In</Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Alumni</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.alumniCount}+</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.jobCount}+</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.eventCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                            <Heart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Donations</p>
                            <p className="text-2xl font-bold text-gray-900">₹{stats.donationTotal.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recent Jobs */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Latest Opportunities</h2>
                            <Link to="/jobs" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentJobs.map(job => (
                                <div key={job._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4 border-green-500">
                                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                                    <p className="text-xs text-blue-500 mt-2 font-medium">{job.jobType}</p>
                                </div>
                            ))}
                            {recentJobs.length === 0 && <p className="text-gray-500">No active jobs requested recently.</p>}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
                            <Link to="/events" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.map(event => (
                                <div key={event._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4 border-purple-500 flex">
                                    <div className="bg-gray-100 rounded-lg p-3 text-center min-w-[60px] mr-4">
                                        <p className="text-xs font-bold text-purple-600 uppercase">{new Date(event.dateTime).toLocaleString('default', { month: 'short' })}</p>
                                        <p className="text-xl font-bold text-gray-900">{new Date(event.dateTime).getDate()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{event.title}</h3>
                                        <p className="text-sm text-gray-600">{event.venue}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                            {upcomingEvents.length === 0 && <p className="text-gray-500">No upcoming events scheduled.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
