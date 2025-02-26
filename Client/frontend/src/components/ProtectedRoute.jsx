// components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    // Redirect to the landing page or login page if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the child component if authenticated
  return children;
};

export default ProtectedRoute;