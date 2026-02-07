import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Award, Star } from 'lucide-react';

const Stories = () => {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stories');
                setStories(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const auth = React.useContext(AuthContext); // Import AuthContext first
    const user = auth?.user;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Alumni Success Stories</h1>
                    <p className="text-gray-600 mt-2">Celebrating the achievements of our global community</p>
                </div>
                {user?.role !== 'student' && (
                    <Link to="/stories/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                        <Star className="h-4 w-4 mr-2" />
                        Share Your Story
                    </Link>
                )}
            </div>

            {loading ? <div className="text-center py-10">Loading stories...</div> :
                stories.length === 0 ? <div className="text-center py-10 text-gray-500">No stories added yet.</div> :
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map(story => (
                            <div key={story._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                                <div className="h-48 bg-gray-200 relative">
                                    {story.photo ? (
                                        <img src={story.photo} alt={story.alumniName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                                            <Award className="h-16 w-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-blue-900 uppercase tracking-widest shadow-sm">
                                        {story.category}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{story.achievementTitle}</h3>
                                    <p className="text-sm text-blue-600 font-medium mb-4">{story.alumniName} <span className="text-gray-400">|</span> {story.currentPosition}</p>

                                    <p className="text-gray-600 mb-4 line-clamp-4 flex-1">"{story.description}"</p>

                                    <div className="mt-auto pt-4 border-t text-sm text-gray-500">
                                        Class of {story.graduationYear}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>}
        </div>
    );
};

export default Stories;
