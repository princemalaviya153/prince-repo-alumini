import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const auth = React.useContext(AuthContext);

    if (!auth) {
        throw new Error('ProtectedRoute must be used within an AuthProvider');
    }

    const { user, loading } = auth;

    if (loading) {
        return <div>Loading...</div>; // Replace with a spinner later
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
