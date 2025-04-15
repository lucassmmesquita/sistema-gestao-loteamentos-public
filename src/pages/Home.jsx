import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Container, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import FileUpload from '../components/common/FileUpload';
import { 
  Person as PersonIcon, 
  Description as DescriptionIcon, 
  Dashboard as DashboardIcon,
  Landscape as LandscapeIcon,
  Receipt as ReceiptIcon,
  LocalAtm as MoneyIcon,
  FileUpload as UploadIcon,
  AutoGraph as AutoGraphIcon,
  Calculate as CalculateIcon,
  NotificationsActive as NotificationsIcon,
  Settings,
  Calculate 
} from '@mui/icons-material';

import {
  AppleSection,
  AppleSectionContent,
  AppleTitle,
  AppleSubtitle,
  AppleText,
  AppleCard,
  AppleCardContent,
  AppleCardActions,
  AppleCardMedia,
  AppleButton,
  AppleFeatureLink
} from '../components/common/AppleComponents';

// Styled components for this page
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(6, 0),
  textAlign: 'center',
  backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
  overflow: 'hidden',
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? 'radial-gradient(circle at center, #1d1d1f 0%, #000 70%)'
    : 'radial-gradient(circle at center, #fff 0%, #f5f5f7 70%)',
  zIndex: 0,
}));

const FeatureCard = styled(AppleCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.background.paper, 0.8)
    : alpha('#fff', 0.8),
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
}));

const IconContainer = styled(Box)(({ theme, colorKey = 'primary' }) => ({
  width: 60,
  height: 60,
  borderRadius: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette[colorKey].main, 0.1),
  color: theme.palette[colorKey].main,
  marginBottom: theme.spacing(2),
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const clienteContratoCards = [
    {
      title: 'Cadastro de Clientes',
      description: 'Gerencie o cadastro de clientes com informações completas e documentos anexados.',
      icon: <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/clientes'),
      buttonText: 'Ver Clientes'
    },
    {
      title: 'Contratos',
      description: 'Crie e gerencie contratos de venda de lotes, com condições personalizadas.',
      icon: <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/contratos'),
      buttonText: 'Ver Contratos'
    },
    {
      title: 'Dashboard',
      description: 'Visualize indicadores e estatísticas sobre vendas, clientes e contratos.',
      icon: <DashboardIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/dashboard'),
      buttonText: 'Ver Dashboard'
    },
    {
      title: 'Lotes',
      description: 'Gerencie informações sobre lotes disponíveis, reservados e vendidos.',
      icon: <LandscapeIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/dashboard'),
      buttonText: 'Ver Lotes'
    }
  ];

  const boletosCards = [
    {
      title: 'Gerenciar Boletos',
      description: 'Visualize, filtre e acompanhe os status de todos os boletos emitidos no sistema.',
      icon: <ReceiptIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/boletos'),
      buttonText: 'Acessar Boletos'
    },
    {
      title: 'Emitir Boletos',
      description: 'Gere boletos individuais ou em lote para os contratos ativos no sistema.',
      icon: <MoneyIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/boletos/emitir'),
      buttonText: 'Emitir Boletos'
    },
    {
      title: 'Arquivos de Remessa',
      description: 'Gere arquivos CNAB 240 para envio à Caixa Econômica Federal.',
      icon: <UploadIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/boletos/arquivos'),
      buttonText: 'Gerar Remessa'
    },
    {
      title: 'Importação de Pagamentos',
      description: 'Importe dados de pagamentos a partir de planilhas ou arquivos de retorno.',
      icon: <FileUpload sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/boletos/arquivos'),
      buttonText: 'Importar Pagamentos'
    }
  ];
  
  // Novos cards para Reajuste Automático
  const reajustesCards = [
    {
      title: 'Calendário de Reajustes',
      description: 'Visualize e gerencie os reajustes contratuais previstos e aplicados em formato de calendário.',
      icon: <AutoGraphIcon sx={{ fontSize: 60, color: 'info.main' }} />,
      action: () => navigate('/reajustes'),
      buttonText: 'Ver Calendário'
    },
    {
      title: 'Configuração de Reajustes',
      description: 'Configure os parâmetros de reajuste, como índice econômico, percentual adicional e intervalo de parcelas.',
      icon: <CalculateIcon sx={{ fontSize: 60, color: 'info.main' }} />,
      action: () => navigate('/reajustes/configuracao'),
      buttonText: 'Configurar'
    }
  ];
  
  return (
    <Container maxWidth="xl" sx={{ px: 1, mt: 2 }}>
      {/* Cadastros e Contratos */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Cadastros e Contratos
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {clienteContratoCards.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <AppleCard 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <AppleCardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </AppleCardContent>
              <AppleCardActions sx={{ p: 2, justifyContent: 'center' }}>
                <AppleButton 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                >
                  {item.buttonText}
                </AppleButton>
              </AppleCardActions>
            </AppleCard>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mb: 4 }} component="hr" />
      
      {/* Gestão de Boletos */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Gestão de Boletos
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {boletosCards.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <AppleCard 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <AppleCardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </AppleCardContent>
              <AppleCardActions sx={{ p: 2, justifyContent: 'center' }}>
                <AppleButton 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                  color="secondary"
                >
                  {item.buttonText}
                </AppleButton>
              </AppleCardActions>
            </AppleCard>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mb: 4 }} component="hr" />
      
      {/* Reajuste Automático de Contratos */}
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 3 }}
      >
        Reajuste Automático de Contratos
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {reajustesCards.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <AppleCard 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <AppleCardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </AppleCardContent>
              <AppleCardActions sx={{ p: 2, justifyContent: 'center' }}>
                <AppleButton 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                  color="info"
                >
                  {item.buttonText}
                </AppleButton>
              </AppleCardActions>
            </AppleCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;