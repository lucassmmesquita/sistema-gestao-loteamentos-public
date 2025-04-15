import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { BusinessOutlined } from '@mui/icons-material';

/**
 * Componente de logo da aplicação
 * @returns {JSX.Element} Componente de logo
 */
const AppLogo = ({ variant = 'full' }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      userSelect: 'none'
    }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        borderRadius: '8px',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        width: 40,
        height: 40
      }}>
        <BusinessOutlined />
      </Box>
      
      {variant === 'full' && (
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700, 
              lineHeight: 1.2, 
              fontSize: '1rem',
              color: theme.palette.primary.main 
            }}
          >
            SGL
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              lineHeight: 1, 
              fontSize: '0.65rem'
            }}
          >
            Gestão de Loteamentos
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AppLogo;