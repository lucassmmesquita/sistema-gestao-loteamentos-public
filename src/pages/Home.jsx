import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Paper,
  Divider
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Description as DescriptionIcon, 
  Dashboard as DashboardIcon,
  Landscape as LandscapeIcon,
  Receipt as ReceiptIcon,
  LocalAtm as MoneyIcon,
  FileUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  AutoGraph as AutoGraphIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  
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
      icon: <FileIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
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
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sistema de Gestão de Loteamentos
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph align="center">
          Gerencie clientes, contratos, lotes e boletos bancários de forma integrada e eficiente
        </Typography>
      </Paper>
      
      <Typography variant="h5" component="h2" gutterBottom>
        Cadastros e Contratos
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {clienteContratoCards.map((item, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Card 
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
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                >
                  {item.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ mb: 4 }} />
      
      <Typography variant="h5" component="h2" gutterBottom>
        Gestão de Boletos
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {boletosCards.map((item, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Card 
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
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                  color="secondary"
                >
                  {item.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ mb: 4 }} />
      
      <Typography variant="h5" component="h2" gutterBottom>
        Reajuste Automático de Contratos
      </Typography>
      <Grid container spacing={4}>
        {reajustesCards.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
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
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                <Box sx={{ mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  onClick={item.action}
                  fullWidth
                  color="info"
                >
                  {item.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Sistema de Gestão de Loteamentos - Todos os direitos reservados
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;