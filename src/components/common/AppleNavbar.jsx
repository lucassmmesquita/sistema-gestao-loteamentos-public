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
  Avatar,
  Button,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  Switch,
  Collapse
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
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
  Calculate as CalculateIcon 
} from '@mui/icons-material';

// Custom styled components
const NavbarContainer = styled(AppBar)(({ theme, transparentOnTop, isTop }) => ({
  backgroundColor: transparentOnTop && isTop 
    ? 'rgba(255, 255, 255, 0)' 
    : theme.palette.mode === 'dark' 
      ? 'rgba(29, 29, 31, 0.8)' 
      : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: transparentOnTop && isTop 
    ? 'none' 
    : `1px solid ${theme.palette.mode === 'dark' 
        ? 'rgba(66, 66, 69, 0.5)' 
        : 'rgba(210, 210, 215, 0.5)'}`,
  transition: 'all 0.3s ease',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  letterSpacing: '-0.025em',
  transition: 'color 0.3s ease',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: '0 8px',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '6px 10px',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1),
  justifyContent: 'flex-end',
  minHeight: 64,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  marginBottom: 4,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-2px)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.15)' : 'rgba(0, 113, 227, 0.1)',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(10, 132, 255, 0.25)' : 'rgba(0, 113, 227, 0.15)',
    },
  },
}));

const ThemeToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

function HideOnScroll(props) {
  const { children, window, threshold = 100 } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: threshold,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const AppleNavbar = ({ transparentOnTop = false, drawerWidth = 240 }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [open, setOpen] = useState(!isMobile);
  const [scrolled, setScrolled] = useState(false);
  const [subMenus, setSubMenus] = useState({
    boletos: false,
    reajustes: false,
    inadimplencia: false
  });
  
  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Menu structure
  const mainMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
    { text: 'Contratos', icon: <DescriptionIcon />, path: '/contratos' },
  ];
  
  const boletosSubMenuItems = [
    { text: 'Gerenciar Boletos', icon: <ReceiptIcon />, path: '/boletos' },
    { text: 'Emitir Boletos', icon: <MoneyIcon />, path: '/boletos/emitir' },
    { text: 'Gerenciador de Arquivos', icon: <UploadIcon />, path: '/boletos/arquivos' },
  ];
  
  const reajustesSubMenuItems = [
    { text: 'Calendário de Reajustes', icon: <AutoGraphIcon />, path: '/reajustes' },
    { text: 'Configuração', icon: <CalculateIcon />, path: '/reajustes/configuracao' },
  ];
  
  const inadimplenciaSubMenuItems = [
    { text: 'Gerenciar Inadimplentes', icon: <WarningIcon />, path: '/inadimplencia' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/inadimplencia/configuracoes' }
  ];
  
  // Toggle drawer
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  // Toggle submenu
  const handleToggleSubmenu = (menu) => {
    setSubMenus({
      ...subMenus,
      [menu]: !subMenus[menu]
    });
  };
  
  // Navigate to page
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Open relevant submenu based on current path
  useEffect(() => {
    if (location.pathname.includes('/boletos')) {
      setSubMenus(prev => ({ ...prev, boletos: true }));
    }
    if (location.pathname.includes('/reajustes')) {
      setSubMenus(prev => ({ ...prev, reajustes: true }));
    }
    if (location.pathname.includes('/inadimplencia')) {
      setSubMenus(prev => ({ ...prev, inadimplencia: true }));
    }
  }, [location.pathname]);
  
  return (
    <>
      <HideOnScroll threshold={transparentOnTop ? 100 : 0}>
        <NavbarContainer 
          position="fixed" 
          transparentOnTop={transparentOnTop}
          isTop={!scrolled && transparentOnTop}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: open ? 'none' : 'flex' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Logo
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  display: { xs: 'flex' },
                  flexGrow: 1,
                  textDecoration: 'none',
                  color: theme.palette.text.primary,
                }}
              >
                Sistema de Gestão
              </Logo>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                  <IconButton onClick={toggleMode} color="inherit">
                    {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </NavbarContainer>
      </HideOnScroll>
      
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: theme.palette.mode === 'dark' 
              ? '4px 0 10px rgba(0, 0, 0, 0.5)' 
              : '4px 0 10px rgba(0, 0, 0, 0.05)',
          },
        }}
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600, 
              ml: 2,
              color: theme.palette.primary.main
            }}
          >
            Gestão de Loteamentos
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        
        <Divider />
        
        <List sx={{ p: 2 }}>
          {/* Main menu items */}
          {mainMenuItems.map((item) => (
            <StyledListItem key={item.text} disablePadding>
              <StyledListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive(item.path) 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive(item.path) ? 600 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </StyledListItemButton>
            </StyledListItem>
          ))}
          
          {/* Boletos submenu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={isActive('/boletos')}
              onClick={() => handleToggleSubmenu('boletos')}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive('/boletos') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Boletos" 
                primaryTypographyProps={{ 
                  fontWeight: isActive('/boletos') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
              {subMenus.boletos ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </StyledListItem>
          
          <Collapse in={subMenus.boletos} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {boletosSubMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigate(item.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem'
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </Collapse>
          
          {/* Reajustes submenu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={isActive('/reajustes')}
              onClick={() => handleToggleSubmenu('reajustes')}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive('/reajustes') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <AutoGraphIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Reajustes" 
                primaryTypographyProps={{ 
                  fontWeight: isActive('/reajustes') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
              {subMenus.reajustes ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </StyledListItem>
          
          <Collapse in={subMenus.reajustes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {reajustesSubMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigate(item.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem'
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </Collapse>
          
          {/* Inadimplência submenu */}
          <StyledListItem disablePadding>
            <StyledListItemButton
              selected={isActive('/inadimplencia')}
              onClick={() => handleToggleSubmenu('inadimplencia')}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive('/inadimplencia') 
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary,
                  minWidth: 40
                }}
              >
                <NotificationsActiveIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Inadimplência" 
                primaryTypographyProps={{ 
                  fontWeight: isActive('/inadimplencia') ? 600 : 500,
                  fontSize: '0.95rem'
                }}
              />
              {subMenus.inadimplencia ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
          </StyledListItem>
          
          <Collapse in={subMenus.inadimplencia} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 2 }}>
              {inadimplenciaSubMenuItems.map((item) => (
                <StyledListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => handleNavigate(item.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '0.9rem'
                      }}
                    />
                  </StyledListItemButton>
                </StyledListItem>
              ))}
            </List>
          </Collapse>
        </List>
        
        <Divider />
        
        <ThemeToggle>
          <DarkModeIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
          <Switch 
            checked={mode === 'dark'} 
            onChange={toggleMode} 
            color="primary" 
          />
          <LightModeIcon sx={{ color: theme.palette.text.secondary, ml: 1 }} />
        </ThemeToggle>
      </Drawer>
    </>
  );
};

export default AppleNavbar;