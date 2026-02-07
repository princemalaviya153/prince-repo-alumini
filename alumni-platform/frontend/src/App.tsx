import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Directory from './pages/Directory';
import JobBoard from './pages/JobBoard';
import JobPost from './pages/JobPost';
import EventList from './pages/EventList';
import EventCreate from './pages/EventCreate';
import Donation from './pages/Donation';
import StorySubmit from './pages/StorySubmit';
import Stories from './pages/Stories';
import Mentorship from './pages/Mentorship';
import Home from './pages/Home';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/jobs" element={<JobBoard />} />
                <Route path="/jobs/new" element={<JobPost />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/new" element={<EventCreate />} />
                <Route path="/donate" element={<Donation />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/stories/new" element={<StorySubmit />} />
                <Route path="/mentorship" element={<Mentorship />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
