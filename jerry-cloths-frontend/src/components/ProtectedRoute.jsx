import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');

  // If no token, redirect to admin login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, allow access to protected routes
  return <Outlet />;
};

export default ProtectedRoute;