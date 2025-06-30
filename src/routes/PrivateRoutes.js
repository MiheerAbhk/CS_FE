// routes/PrivateRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // assuming role is stored on login

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireAuth;
