import React from 'react';
import { Box, Container, Typography, Link, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Componente Footer estilizado - corrigido para não ficar atrás do menu lateral
const FooterContainer = styled(Box)(({ theme, drawerWidth, open }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(29, 29, 31, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderTop: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(66, 66, 69, 0.5)' 
    : 'rgba(210, 210, 215, 0.5)'}`,
  position: 'fixed',
  bottom: 0,
  right: 0,
  width: open ? `calc(100% - ${drawerWidth}px)` : '100%', // Ajusta a largura baseado no estado do drawer
  padding: theme.spacing(1.5, 0),
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down('md')]: {
    width: '100%', // Em dispositivos móveis, ocupa toda a largura
  },
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.85rem',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const AppFooter = ({ drawerWidth = 240, open = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.0"; // Versão do sistema

  return (
    <FooterContainer drawerWidth={drawerWidth} open={open}>
      <FooterContent maxWidth="xl">
        {/* Copyright e Versão */}
        <FooterText>
          &copy; {currentYear} 5DX DataLab | Sistema de Gestão de Loteamentos
        </FooterText>

        {/* Versão */}
        <FooterText>
          Versão {appVersion}
        </FooterText>

        {/* Suporte */}
        <FooterText>
          <FooterLink href="mailto:suporte@sistemaloteamentos.com.br">
            5DX DataLab - Suporte Técnico
          </FooterLink>
        </FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default AppFooter;