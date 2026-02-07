import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react';

// Basic Debounce Hook Implementation inline for simplicity if not exists
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const Directory = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounceValue(searchTerm, 500);
    const [filters, setFilters] = useState({
        graduationYear: '',
        industry: '',
        location: ''
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params = {
                    name: debouncedSearch,
                    ...filters,
                    page
                };
                // Clean empty params
                Object.keys(params).forEach(key => (params as any)[key] === '' && delete (params as any)[key]);

                const response = await axios.get('http://localhost:5000/api/users', { params });
                setUsers(response.data.users);
                setTotalPages(response.data.pages);
                setTotalCount(response.data.total);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [debouncedSearch, filters, page]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); // Reset to page 1 on filter change
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Alumni Directory ({totalCount})</h1>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, company..."
                            className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select name="industry" onChange={handleFilterChange} className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                    </select>
                    <input
                        type="number"
                        name="graduationYear"
                        placeholder="Year"
                        onChange={handleFilterChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        onChange={handleFilterChange}
                        className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map(user => (
                        <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={user.profilePhoto || "https://uia-avatars.com/api/?name=" + user.name}
                                        alt={user.name}
                                        className="h-16 w-16 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.currentPosition}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        <span>{user.company || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <GraduationCap className="h-4 w-4 mr-2" />
                                        <span>{user.degree} {user.graduationYear ? `'${user.graduationYear.toString().slice(-2)}` : ''}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{user.location || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.industry || 'Alumni'}
                                    </span>
                                    {/* View Profile Button could go here */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex justify-center space-x-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Directory;
