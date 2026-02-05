// src/components/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    // Timeout auth loading after 3 seconds
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout - rendering anyway');
        setAuthTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !authTimeout) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
export default ProtectedRoute;