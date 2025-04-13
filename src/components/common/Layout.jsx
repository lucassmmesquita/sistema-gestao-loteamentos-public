import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material';
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
  Settings as SettingsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { 
    AutoGraph as AutoGraphIcon, 
    Calculate as CalculateIcon 
  } from '@mui/icons-material';
  
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
  }),
);

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

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
  const location = useLocation();
  const [open, setOpen] = useState(!isMobile);
  const [boletosOpen, setBoletosOpen] = useState(location.pathname.includes('/boletos'));
  const [reajustesOpen, setReajustesOpen] = useState(location.pathname.includes('/reajustes'));
  const [inadimplenciaOpen, setInadimplenciaOpen] = useState(location.pathname.includes('/inadimplencia'));

  const navigate = useNavigate();

  const handleToggleReajustesMenu = () => {
    setReajustesOpen(!reajustesOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToggleSubMenu = () => {
    setBoletosOpen(!boletosOpen);
  };

  const handleToggleInadimplenciaMenu = () => {
    setInadimplenciaOpen(!inadimplenciaOpen);
  };


  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
    { text: 'Contratos', icon: <DescriptionIcon />, path: '/contratos' },
  ];

  const reajustesSubMenuItems = [
    { text: 'Calendário de Reajustes', icon: <AutoGraphIcon />, path: '/reajustes' },
    { text: 'Configuração', icon: <CalculateIcon />, path: '/reajustes/configuracao' },
  ];

  const boletosSubMenuItems = [
    { text: 'Gerenciar Boletos', icon: <ReceiptIcon />, path: '/boletos' },
    { text: 'Emitir Boletos', icon: <MoneyIcon />, path: '/boletos/emitir' },
    { text: 'Gerenciador de Arquivos', icon: <UploadIcon />, path: '/boletos/arquivos' },
  ];

  // Submenu de Inadimplência simplificado
  const inadimplenciaSubMenuItems = [
    { text: 'Gerenciar Inadimplentes', icon: <WarningIcon />, path: '/inadimplencia' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/inadimplencia/configuracoes' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistema de Gestão de Loteamentos
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          
          {/* Item de menu de Boletos com submenu */}
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleToggleSubMenu}
              selected={location.pathname.includes('/boletos')}
            >
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary="Boletos" />
              {boletosOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          {/* Submenu de Boletos */}
          <Collapse in={boletosOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {boletosSubMenuItems.map((item) => (
                <ListItemButton 
                  key={item.text}
                  sx={{ pl: 4 }}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Item de menu de Reajustes com submenu */}
          <ListItem disablePadding>
            <ListItemButton 
                onClick={handleToggleReajustesMenu}
                selected={location.pathname.includes('/reajustes')}
            >
                <ListItemIcon>
                  <AutoGraphIcon />
                </ListItemIcon>
                <ListItemText primary="Reajustes" />
                {reajustesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* Submenu de Reajustes */}
          <Collapse in={reajustesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {reajustesSubMenuItems.map((item) => (
                <ListItemButton 
                    key={item.text}
                    sx={{ pl: 4 }}
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                >
                    <ListItemIcon>
                    {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
                ))}
            </List>
          </Collapse>

          {/* Item de menu de Inadimplência com submenu */}
          <ListItem disablePadding>
            <ListItemButton 
                onClick={handleToggleInadimplenciaMenu}
                selected={location.pathname.includes('/inadimplencia')}
            >
                <ListItemIcon>
                  <NotificationsActiveIcon />
                </ListItemIcon>
                <ListItemText primary="Inadimplência" />
                {inadimplenciaOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>

          {/* Submenu de Inadimplência simplificado */}
          <Collapse in={inadimplenciaOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {inadimplenciaSubMenuItems.map((item) => (
                <ListItemButton 
                    key={item.text}
                    sx={{ pl: 4 }}
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                >
                    <ListItemIcon>
                    {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                </ListItemButton>
                ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Breadcrumb />
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Outlet />
        </Container>
      </Main>
    </Box>
  );
};



export default Layout;