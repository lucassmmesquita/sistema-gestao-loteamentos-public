import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Box, Divider, Chip, Grid, Paper, IconButton,
  useMediaQuery, CircularProgress
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  Close, CheckCircle, WarningAmber, CalendarMonth, 
  Person, Description, Payments, Calculate, ReceiptLong
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReajusteContext } from '../../contexts/ReajusteContext';

// Estilos personalizados
const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'flex-start',
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  minWidth: 150,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: 16,
  fontWeight: 500,
  backgroundColor: status === 'pendente' 
    ? alpha(theme.palette.warning.main, 0.1) 
    : status === 'aplicado' 
      ? alpha(theme.palette.success.main, 0.1) 
      : alpha(theme.palette.grey[500], 0.1),
  color: status === 'pendente' 
    ? theme.palette.warning.dark 
    : status === 'aplicado' 
      ? theme.palette.success.dark 
      : theme.palette.grey[700],
  border: `1px solid ${
    status === 'pendente' 
      ? alpha(theme.palette.warning.main, 0.2) 
      : status === 'aplicado' 
        ? alpha(theme.palette.success.main, 0.2) 
        : alpha(theme.palette.grey[500], 0.2)
  }`,
  '& .MuiChip-icon': {
    color: 'inherit',
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ContractValueBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.5) 
    : alpha(theme.palette.background.paper, 0.7),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

const ValueLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: theme.spacing(0.5),
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ValueAmount = styled(Typography)(({ theme, isOriginal, isReajustado }) => ({
  fontSize: isOriginal ? '1.25rem' : '1.5rem',
  fontWeight: isReajustado ? 600 : 400,
  color: isReajustado ? theme.palette.primary.main : theme.palette.text.primary,
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ReajusteArrow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 40,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    height: 2,
    width: '80%',
    backgroundColor: theme.palette.divider,
    top: '50%',
    left: '10%',
    transform: 'translateY(-50%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    height: 10,
    width: 10,
    backgroundColor: theme.palette.divider,
    top: '50%',
    right: '10%',
    transform: 'translateY(-50%) rotate(45deg)',
    borderTop: `2px solid ${theme.palette.divider}`,
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const ReajustePercentage = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0.5, 1),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  zIndex: 1,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

// Componente principal
const DetalheReajuste = ({ open, onClose, reajuste, onAplicar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { loading } = useReajusteContext();
  
  // Se não tiver reajuste, não renderiza nada
  if (!reajuste) {
    return null;
  }
  
  // Verifica se é uma visualização de reajuste aplicado ou pendente
  const isReajusteAplicado = reajuste.status === 'aplicado';
  
  // Formata valores para exibição
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };
  
  const formatarData = (data) => {
    if (!data) return '';
    const dataObj = typeof data === 'string' ? parseISO(data) : data;
    return format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  
  const formatarPercentual = (valor) => {
    return `${valor.toFixed(2)}%`;
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : theme.shape.borderRadius,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarMonth color="primary" />
          <Typography variant="h6" sx={{ 
            fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif', 
            fontWeight: 500 
          }}>
            {isReajusteAplicado ? 'Detalhes do Reajuste Aplicado' : 'Reajuste Pendente'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StatusChip 
            label={isReajusteAplicado ? 'Aplicado' : 'Pendente'} 
            status={isReajusteAplicado ? 'aplicado' : 'pendente'}
            icon={isReajusteAplicado ? <CheckCircle /> : <WarningAmber />}
            size="small"
          />
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações do contrato */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardTitle variant="h6">
                <Description fontSize="small" color="primary" />
                Dados do Contrato
              </CardTitle>
              <Divider sx={{ mb: 2 }} />
              
              <InfoRow>
                <InfoLabel variant="body2">Número do Contrato:</InfoLabel>
                <InfoValue variant="body2">
                    {reajuste.contrato?.numero || 
                    (reajuste.contratoId ? `#${reajuste.contratoId}` : 'Não identificado')}
                </InfoValue>
                </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Cliente:</InfoLabel>
                <InfoValue variant="body2">
                  {reajuste.cliente?.nome || 'Não informado'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Documento:</InfoLabel>
                <InfoValue variant="body2">
                  {reajuste.cliente?.documento || 'Não informado'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Parcela Referência:</InfoLabel>
                <InfoValue variant="body2">
                  {reajuste.parcelaReferencia}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Data de Referência:</InfoLabel>
                <InfoValue variant="body2">
                  {formatarData(reajuste.dataReferencia)}
                </InfoValue>
              </InfoRow>
            </InfoCard>
          </Grid>
          
          {/* Informações do reajuste */}
          <Grid item xs={12} md={6}>
            <InfoCard>
              <CardTitle variant="h6">
                <Calculate fontSize="small" color="primary" />
                Detalhes do Reajuste
              </CardTitle>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={5}>
                    <ContractValueBox>
                      <ValueLabel>Valor Original</ValueLabel>
                      <ValueAmount isOriginal>
                        {formatarValor(reajuste.valorOriginal)}
                      </ValueAmount>
                    </ContractValueBox>
                  </Grid>
                  
                  <Grid item xs={12} sm={2}>
                    <ReajusteArrow>
                      <ReajustePercentage>
                        <Calculate fontSize="small" color="action" />
                        {formatarPercentual(reajuste.reajusteTotal)}
                      </ReajustePercentage>
                    </ReajusteArrow>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <ContractValueBox>
                      <ValueLabel>Valor Reajustado</ValueLabel>
                      <ValueAmount isReajustado>
                        {formatarValor(reajuste.valorReajustado)}
                      </ValueAmount>
                    </ContractValueBox>
                  </Grid>
                </Grid>
              </Box>
              
              <InfoRow>
                <InfoLabel variant="body2">Índice Base:</InfoLabel>
                <InfoValue variant="body2">
                  {reajuste.indiceBase || 'IGPM'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Valor do Índice:</InfoLabel>
                <InfoValue variant="body2">
                  {formatarPercentual(reajuste.indiceAplicado)}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Percentual Adicional:</InfoLabel>
                <InfoValue variant="body2">
                  {formatarPercentual(reajuste.percentualAdicional)}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel variant="body2">Reajuste Total:</InfoLabel>
                <InfoValue variant="body2" fontWeight={600} color="primary">
                  {formatarPercentual(reajuste.reajusteTotal)}
                </InfoValue>
              </InfoRow>
              
              {isReajusteAplicado && reajuste.dataAplicacao && (
                <InfoRow>
                  <InfoLabel variant="body2">Data de Aplicação:</InfoLabel>
                  <InfoValue variant="body2">
                    {formatarData(reajuste.dataAplicacao)}
                  </InfoValue>
                </InfoRow>
              )}
            </InfoCard>
          </Grid>
          
          {/* Informações adicionais se necessário */}
          {isReajusteAplicado && (
            <Grid item xs={12}>
              <InfoCard>
                <CardTitle variant="h6">
                  <ReceiptLong fontSize="small" color="primary" />
                  Detalhes da Aplicação
                </CardTitle>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Este reajuste foi aplicado em {formatarData(reajuste.dataAplicacao)}.
                  O valor das parcelas foi atualizado de {formatarValor(reajuste.valorOriginal)} para {formatarValor(reajuste.valorReajustado)}.
                </Typography>
              </InfoCard>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px', textTransform: 'none' }}>
          Fechar
        </Button>
        
        {!isReajusteAplicado && (
          <Button 
            onClick={() => onAplicar(reajuste.contratoId)} 
            variant="contained" 
            color="primary" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
            sx={{ borderRadius: '8px', textTransform: 'none' }}
          >
            {loading ? 'Aplicando...' : 'Aplicar Reajuste'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DetalheReajuste;