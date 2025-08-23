// মূল অ্যাপ্লিকেশন কম্পোনেন্ট
// Main application component

// React ইমপোর্ট করা হচ্ছে
// Importing React
import React, { useState, useEffect } from 'react';

// React Router ইমপোর্ট করা হচ্ছে
// Importing React Router
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// স্টাইল কম্পোনেন্ট ইমপোর্ট করা হচ্ছে
// Importing styled components
import styled from 'styled-components';

// কম্পোনেন্টগুলি ইমপোর্ট করা হচ্ছে
// Importing components
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import VideoCards from './components/VideoCards';
import ProtectedRoute from './components/ProtectedRoute';

// নোটিফিকেশন সিস্টেম ইমপোর্ট করা হচ্ছে
// Importing notification system
import { NotificationSystem, useNotification } from './components/Notification';

// অ্যাপ্লিকেশনের মূল কন্টেইনার স্টাইল
// Main container styling for application
const AppContainer = styled.div`
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

// App কম্পোনেন্ট
// App component
function App() {
  // নোটিফিকেশন হুক ব্যবহার করা হচ্ছে
  // Using notification hook
  const { notifications, removeNotification } = useNotification();

  // অথেনটিকেশন স্টেট
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = localStorage.getItem('authToken');
    const authStatus = localStorage.getItem('isAuthenticated');

    if (authToken && authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  const handleLogout = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <AppContainer>
      <Router>
        <Routes>
          {/* মূল পেজ - ভিডিও কার্ডস */}
          {/* Main page - Video cards */}
          <Route
            path="/"
            element={
              <VideoCards />
            }
          />

          {/* অ্যাডমিন প্যানেল - প্রটেক্টেড রাউট */}
          {/* Admin panel - Protected route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* লগইন পেজ - যদি অথেনটিকেটেড না হয় */}
          {/* Login page - If not authenticated */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* ডিফল্ট রিডাইরেক্ট */}
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* নোটিফিকেশন সিস্টেম */}
      {/* Notification system */}
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </AppContainer>
  );
}

export default App;
