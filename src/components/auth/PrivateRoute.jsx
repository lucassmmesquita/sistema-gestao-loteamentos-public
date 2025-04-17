// src/components/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import useAuth from '../../hooks/useAuth';

/**
 * Componente para proteger rotas, verificando autenticação e permissões
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.permissions - Lista de permissões necessárias
 * @returns {JSX.Element} Componente renderizado
 */
const PrivateRoute = ({ permissions = [] }) => {
  const { user, loading, isAuthenticated, hasAnyPermission } = useAuth();
  const location = useLocation();
  
  // Verifica se está carregando
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Verifica permissões
  if (permissions.length > 0 && !hasAnyPermission(permissions)) {
    return <Navigate to="/access-denied" replace />;
  }
  
  // Renderiza o conteúdo da rota
  return <Outlet />;
};

export default PrivateRoute;