import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole = 'Fan' }) {
  const location = useLocation();
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('clubverse_user') || 'null');
  } catch (e) {
    currentUser = null;
  }
  const token = localStorage.getItem('clubverse_token');

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location, message: 'Please log in to access your dashboard session.' }} replace />;
  }

  // Verify JWT session expiration if token is present
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64));
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('clubverse_user');
          localStorage.removeItem('clubverse_token');
          return <Navigate to="/login" state={{ from: location, message: 'Session expired. Please log in again.' }} replace />;
        }
      }
    } catch (err) {
      // Ignore parse error and proceed with role check
    }
  }

  // Check role authorization if specified
  const allowedRoles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (allowedRole && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" state={{ from: location, message: `Access restricted. Your account role (${currentUser.role || 'User'}) does not have permission.` }} replace />;
  }

  return children;
}
