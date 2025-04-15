import React from 'react';
import { Breadcrumbs, Link, Typography, Box, useMediaQuery } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';

// Styled components
const BreadcrumbWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
  textDecoration: 'none',
  padding: '4px 8px',
  borderRadius: 6,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.primary.main, 0.1) 
      : alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const CurrentBreadcrumb = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  padding: '4px 8px',
}));

const Breadcrumb = () => {
  const theme = useTheme();
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Truncate breadcrumbs on mobile to show only the last two
  const displayPathnames = isMobile && pathnames.length > 2 
    ? pathnames.slice(pathnames.length - 2) 
    : pathnames;
  
  // Mapping of routes to friendly names
  const routeNameMap = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    cadastro: 'Cadastro',
    editar: 'Editar',
    contratos: 'Contratos',
    boletos: 'Boletos',
    emitir: 'Emitir',
    arquivos: 'Gerenciador de Arquivos',
    reajustes: 'Reajustes',
    configuracao: 'Configuração',
    inadimplencia: 'Inadimplência',
    'acoes-cobranca': 'Ações de Cobrança',
    gatilhos: 'Gatilhos Automáticos'
  };
  
  // Special routes with custom names
  const specialRoutes = {
    '/inadimplencia': 'Dashboard de Inadimplência',
    '/inadimplencia/clientes': 'Clientes Inadimplentes'
  };
  
  // If we have a special name for this route, use it
  const getRouteDisplayName = (route, fullPath) => {
    if (specialRoutes[fullPath]) {
      return specialRoutes[fullPath];
    }
    return routeNameMap[route] || route;
  };
  
  if (pathnames.length === 0) {
    return null; // No breadcrumbs on home page
  }
  
  return (
    <BreadcrumbWrapper>
      <Breadcrumbs 
        separator={<ChevronRight fontSize="small" sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }} />}
        aria-label="breadcrumb"
      >
        {/* Home link, always shown */}
        <BreadcrumbLink component={RouterLink} to="/" color="inherit">
          Home
        </BreadcrumbLink>
        
        {/* Show ellipsis on mobile if paths are truncated */}
        {isMobile && pathnames.length > 2 && (
          <Typography 
            color="textSecondary" 
            sx={{ fontSize: '0.875rem', padding: '4px 0' }}
          >
            ...
          </Typography>
        )}
        
        {/* Map through paths */}
        {displayPathnames.map((value, index) => {
          const last = index === displayPathnames.length - 1;
          // Calculate the real path index if we're showing truncated breadcrumbs
          const realPathIndex = isMobile && pathnames.length > 2 
            ? pathnames.length - 2 + index 
            : index;
          
          const to = `/${pathnames.slice(0, realPathIndex + 1).join('/')}`;
          const displayName = getRouteDisplayName(value, to);
          
          return last ? (
            <CurrentBreadcrumb key={to} color="textPrimary">
              {displayName}
            </CurrentBreadcrumb>
          ) : (
            <BreadcrumbLink
              key={to}
              component={RouterLink}
              to={to}
            >
              {displayName}
            </BreadcrumbLink>
          );
        })}
      </Breadcrumbs>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;