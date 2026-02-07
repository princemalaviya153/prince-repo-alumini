import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const JobBoard = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        jobType: '',
        category: '',
        location: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const params = { ...filters };
                Object.keys(params).forEach(key => (params as any)[key] === '' && delete (params as any)[key]);
                const response = await axios.get('http://localhost:5000/api/jobs', { params });
                setJobs(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        // Debounce implementation could be added here
        const timer = setTimeout(() => {
            fetchJobs();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
                <Link to="/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Post a Job
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search title, company..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select name="jobType" onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={filters.location}
                        onChange={handleFilterChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Job List */}
            <div className="space-y-4">
                {loading ? <div className="text-center py-10">Loading jobs...</div> :
                    jobs.length === 0 ? <div className="text-center py-10 text-gray-500">No jobs found matching your criteria.</div> :
                        jobs.map(job => (
                            <div key={job._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-600">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <Briefcase className="h-4 w-4 mr-1" />
                                            <span className="mr-4">{job.company}</span>
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">{job.jobType}</span>
                                            {job.salaryRange && (
                                                <div className="flex items-center">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    {job.salaryRange}
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Posted {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={job.applicationUrl || `mailto:?subject=Application for ${job.title}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 text-sm font-medium"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default JobBoard;
