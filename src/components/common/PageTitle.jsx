import React from 'react';
import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Componente de título da página com estilo padronizado
 * @param {Object} props - Props do componente
 * @param {string} props.title - Título principal da página
 * @param {string} [props.subtitle] - Subtítulo opcional da página
 * @param {React.ReactNode} [props.action] - Componente de ação opcional para exibir ao lado do título
 * @returns {JSX.Element} Componente de título da página
 */
const PageTitle = ({ title, subtitle, action }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: isMobile && action ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile && action ? 'flex-start' : 'center',
        mb: 4
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            letterSpacing: -0.5,
            mb: subtitle ? 1 : 0
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {action && (
        <Box sx={{ mt: isMobile ? 2 : 0 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node
};

export default PageTitle;