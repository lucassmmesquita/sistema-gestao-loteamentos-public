import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, useMediaQuery } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Home as HomeIcon } from '@mui/icons-material';
import { AppleButton } from '../components/common/AppleComponents';

// Styled components
const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '70vh',
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const NotFoundTitle = styled(Typography)(({ theme }) => ({
  fontSize: '10rem',
  fontWeight: 700,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0a84ff 0%, #81e9e6 100%)'
    : 'linear-gradient(135deg, #0071e3 0%, #40c8e0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  lineHeight: 1,
  letterSpacing: '-0.05em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '6rem',
  },
}));

const NotFoundSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  letterSpacing: '-0.025em',
  color: theme.palette.text.primary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

const NotFoundText = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: theme.palette.text.secondary,
  maxWidth: 500,
  marginBottom: theme.spacing(4),
}));

const NotFoundIllustration = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  height: 250,
  marginBottom: theme.spacing(4),
  background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" fill="none"><path d="M155 150C155 116.863 181.863 90 215 90H275C308.137 90 335 116.863 335 150V220C335 253.137 308.137 280 275 280H215C181.863 280 155 253.137 155 220V150Z" fill="%23${theme.palette.mode === 'dark' ? '2d2d2f' : 'f5f5f7'}"/><path d="M230 120L270 160M270 120L230 160" stroke="%23${theme.palette.mode === 'dark' ? 'f5f5f7' : '1d1d1f'}" stroke-width="10" stroke-linecap="round"/><path d="M245 190H255" stroke="%23${theme.palette.mode === 'dark' ? 'f5f5f7' : '1d1d1f'}" stroke-width="10" stroke-linecap="round"/></svg>')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
}));

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Container maxWidth="md">
      <NotFoundContainer>
        <NotFoundTitle variant="h1">404</NotFoundTitle>
        
        <NotFoundSubtitle variant="h2">Página não encontrada</NotFoundSubtitle>
        
        <NotFoundIllustration />
        
        <NotFoundText variant="body1">
          A página que você está procurando não existe ou foi movida.
          Verifique se o endereço está correto ou volte para a página inicial.
        </NotFoundText>
        
        <AppleButton
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ px: 4, py: 1.2 }}
        >
          Voltar para Home
        </AppleButton>
      </NotFoundContainer>
    </Container>
  );
};

export default NotFound;