import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  Switch,
  Collapse,
  Drawer,
  List
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../ThemeProvider';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  LocalAtm as MoneyIcon,
  Payment as PaymentIcon,
  FileUpload as UploadIcon,
  ExpandLess,
  ExpandMore,
  NotificationsActive as NotificationsActiveIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AutoGraph as AutoGraphIcon, 
  Calculate as CalculateIcon, 
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon
} from '@mui/icons-material';

// Custom styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 2),
  justifyContent: 'center',
  minHeight: 80,  // Mais espaço para a logo
  flexDirection: 'column',
  marginTop: 64, // Espaço para evitar que fique embaixo do header
}));

const DrawerLogo = styled('img')(({ theme }) => ({
  height: 40,
  marginBottom: theme.spacing(1),
}));

// Função para compor o componente de DrawerHeader
const CustomDrawerHeader = () => {
  const theme = useTheme();
  
  return (
    <DrawerHeader>
      {/* Espaço para logo */}
      <DrawerLogo src="/logo192.png" alt="Logo do Sistema" />
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          color: theme.palette.primary.main,
          textAlign: 'center'
        }}
      >
        Gestão de Loteamentos
      </Typography>
    </DrawerHeader>
  );
};

export default CustomDrawerHeader;