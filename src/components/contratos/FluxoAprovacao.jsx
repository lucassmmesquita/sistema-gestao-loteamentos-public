// src/components/contratos/FluxoAprovacao.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Person as VendedorIcon,
  Business as DiretorIcon,
  AccountBalance as ProprietarioIcon
} from '@mui/icons-material';
import useContratos from '../../hooks/useContratos';
import useAuth from '../../hooks/useAuth';
import UploadContratoOficial from './UploadContratoOficial';

const FluxoAprovacao = ({ contrato }) => {
  const { aprovarContrato } = useContratos();
  const { user, isLoteadora, isVendedor, isDonoTerreno } = useAuth();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aprovacaoTipo, setAprovacaoTipo] = useState(null);
  const [observacao, setObservacao] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const estadoContrato = contrato?.estado || 'pre_contrato';
  
  // Determinar o passo ativo no stepper
  const getActiveStep = () => {
    switch (estadoContrato) {
      case 'pre_contrato':
        return 0;
      case 'em_aprovacao':
        if (contrato.aprovadoVendedor && !contrato.aprovadoDiretor) return 1;
        if (contrato.aprovadoDiretor && !contrato.aprovadoProprietario) return 2;
        return 1;
      case 'aprovado':
        return 3;
      case 'oficializado':
        return 4;
      default:
        return 0;
    }
  };
  
  // Verificar permissões do usuário atual
  const canApprove = (nivel) => {
    switch (nivel) {
      case 'vendedor':
        return isVendedor() && contrato.vendedorId === user.id || isLoteadora();
      case 'diretor':
        return isLoteadora();
      case 'proprietario':
        return isDonoTerreno() && contrato.proprietarioId === user.id || isLoteadora();
      default:
        return false;
    }
  };
  
  const canOfficialize = () => {
    return isLoteadora() && estadoContrato === 'aprovado';
  };
  
  const handleAprovacaoClick = (nivel, aprovar) => {
    setAprovacaoTipo({ nivel, aprovar });
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setAprovacaoTipo(null);
    setObservacao('');
  };
  
  const handleConfirmarAprovacao = async () => {
    try {
      await aprovarContrato(
        contrato.id, 
        aprovacaoTipo.nivel, 
        aprovacaoTipo.aprovar, 
        observacao
      );
      
      setNotification({
        open: true,
        message: `Contrato ${aprovacaoTipo.aprovar ? 'aprovado' : 'rejeitado'} com sucesso`,
        severity: 'success'
      });
      
      handleDialogClose();
    } catch (error) {
      console.error('Erro ao processar aprovação:', error);
      setNotification({
        open: true,
        message: `Erro ao processar aprovação: ${error.message || 'Erro desconhecido'}`,
        severity: 'error'
      });
    }
  };
  
  const activeStep = getActiveStep();
  
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        Fluxo de Aprovação
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VendedorIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Aprovação do Vendedor</Typography>
              {contrato.aprovadoVendedor && <CheckIcon color="success" sx={{ ml: 1 }} />}
            </Box>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Nesta etapa, o vendedor verifica os dados do pré-contrato e confirma que estão corretos.
            </Typography>
            
            {canApprove('vendedor') && estadoContrato === 'pre_contrato' && (
              <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAprovacaoClick('vendedor', true)}
                  startIcon={<CheckIcon />}
                >
                  Aprovar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleAprovacaoClick('vendedor', false)}
                  startIcon={<CloseIcon />}
                >
                  Rejeitar
                </Button>
              </Box>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DiretorIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Aprovação do Diretor</Typography>
              {contrato.aprovadoDiretor && <CheckIcon color="success" sx={{ ml: 1 }} />}
            </Box>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Nesta etapa, o diretor comercial avalia o pré-contrato e valida as condições comerciais.
            </Typography>
            
            {canApprove('diretor') && contrato.aprovadoVendedor && !contrato.aprovadoDiretor && (
              <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAprovacaoClick('diretor', true)}
                  startIcon={<CheckIcon />}
                >
                  Aprovar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleAprovacaoClick('diretor', false)}
                  startIcon={<CloseIcon />}
                >
                  Rejeitar
                </Button>
              </Box>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ProprietarioIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Aprovação do Proprietário</Typography>
              {contrato.aprovadoProprietario && <CheckIcon color="success" sx={{ ml: 1 }} />}
            </Box>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              Nesta etapa, o proprietário do loteamento realiza a aprovação final do contrato.
            </Typography>
            
            {canApprove('proprietario') && contrato.aprovadoDiretor && !contrato.aprovadoProprietario && (
              <Box sx={{ mt: 2, mb: 1, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleAprovacaoClick('proprietario', true)}
                  startIcon={<CheckIcon />}
                >
                  Aprovar
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleAprovacaoClick('proprietario', false)}
                  startIcon={<CloseIcon />}
                >
                  Rejeitar
                </Button>
              </Box>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            <Typography variant="subtitle1">Contrato Aprovado</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              O contrato foi aprovado em todas as instâncias e está pronto para ser impresso, assinado e oficializado.
            </Typography>
            
            {canOfficialize() && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <UploadContratoOficial contratoId={contrato.id} />
              </Box>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel>
            <Typography variant="subtitle1">Contrato Oficializado</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              O contrato foi oficializado e não pode mais ser alterado diretamente.
              Quaisquer alterações futuras devem ser feitas por meio de aditivos contratuais.
            </Typography>
            
            {contrato.contratoOficialUrl && (
              <Button
                variant="outlined"
                color="primary"
                href={contrato.contratoOficialUrl}
                target="_blank"
                sx={{ mt: 2 }}
              >
                Visualizar Contrato Oficial
              </Button>
            )}
          </StepContent>
        </Step>
      </Stepper>
      
      {/* Diálogo de confirmação */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {aprovacaoTipo?.aprovar ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {aprovacaoTipo?.aprovar 
              ? 'Tem certeza que deseja aprovar este contrato?' 
              : 'Por favor, informe o motivo da rejeição do contrato:'}
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Observações"
            fullWidth
            multiline
            rows={4}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            required={!aprovacaoTipo?.aprovar}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button 
            onClick={handleConfirmarAprovacao} 
            color={aprovacaoTipo?.aprovar ? "success" : "error"}
            variant="contained"
            disabled={!aprovacaoTipo?.aprovar && !observacao}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notificação */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FluxoAprovacao;