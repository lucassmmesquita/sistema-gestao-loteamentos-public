// src/pages/auth/AccessDenied.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Block as BlockIcon, 
  Home as HomeIcon 
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

const AccessDenied = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Resto do código...
};

export default AccessDenied;