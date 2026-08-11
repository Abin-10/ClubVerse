import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole = 'Fan' }) {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, message: 'Please log in to access your dashboard.' }} replace />;
  }

  // Check role authorization if specified
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (allowedRole && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" state={{ from: location, message: `Access restricted. Your account role (${currentUser.role || 'User'}) does not have permission.` }} replace />;
  }

  return children;
}
