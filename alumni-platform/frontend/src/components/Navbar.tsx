import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
    const auth = useContext(AuthContext);
    const { user, logout } = auth || {};
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Directory', path: '/directory' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Events', path: '/events' },
        { name: 'Donate', path: '/donate' },
        { name: 'Stories', path: '/stories' },
        { name: 'Mentorship', path: '/mentorship' },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-blue-600">AlumniConnect</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:ml-6 md:flex md:space-x-8 md:items-center">
                        {navLinks.filter(link => {
                            if (user?.role === 'event_coordinator') {
                                return link.name === 'Events';
                            }
                            if (user?.role === 'student') {
                                return link.name !== 'Donate';
                            }
                            if (user?.role === 'admin') {
                                // Admins might not need to see Mentorship if it's strictly Alumni-Student, but good for oversight.
                                return true;
                            }
                            return true;
                        }).map((link) => (
                            <Link key={link.name} to={link.path} className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="ml-4 flex items-center space-x-4">
                                <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="" className="h-8 w-8 rounded-full object-cover mr-2" />
                                    ) : (
                                        <User className="h-6 w-6 mr-1" />
                                    )}
                                    <span className="text-sm font-medium">{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="ml-4 flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setIsOpen(false); }}
                                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-gray-50 hover:border-gray-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-gray-50 hover:border-gray-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
