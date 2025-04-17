// src/components/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, permissions = [] }) => {
  const { isAuthenticated, loading, hasAnyPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para o login, salvando a rota atual para redirecionamento após login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se há permissões especificadas, verifica se o usuário tem acesso
  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
};

export default PrivateRoute;