import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);
    const userRole = user?.system_role || 'client';
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;