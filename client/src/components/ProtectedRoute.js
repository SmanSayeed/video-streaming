// প্রটেক্টেড রাউট কম্পোনেন্ট - অ্যাডমিন রাউটস প্রটেক্ট করার জন্য
// Protected Route Component - For protecting admin routes

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
