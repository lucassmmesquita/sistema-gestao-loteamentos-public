import React from 'react';
import { CircularProgress, Backdrop, Typography, Box } from '@mui/material';

const Loading = ({ open, message = 'Carregando...' }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column'
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">{message}</Typography>
        </Box>
      )}
    </Backdrop>
  );
};

export default Loading;