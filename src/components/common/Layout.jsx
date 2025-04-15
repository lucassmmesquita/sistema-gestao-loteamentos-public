import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AppleNavbar from './AppleNavbar';
import Breadcrumb from './Breadcrumb';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      padding: theme.spacing(2),
    },
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  // Update drawer state when screen size changes
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Toggle drawer
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Apple-inspired Navbar */}
      <AppleNavbar 
        drawerWidth={drawerWidth} 
        open={open} 
        setOpen={setOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      
      {/* Main content */}
      <Main open={open}>
        <DrawerHeader />
        <Breadcrumb />
        <Box sx={{ 
          mt: 2, 
          minHeight: 'calc(100vh - 64px - 48px)',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;