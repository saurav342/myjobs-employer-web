import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, bootstrapping } = useAuth();
  const location = useLocation();
  if (bootstrapping) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  // Ensure only employers access
  if (user.userType !== 'employer') return <Navigate to="/login" replace />;
  return children;
}

