// src/components/documentos/ImportarContratos.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  LinearProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Check as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import FileUpload from '../common/FileUpload';
import { formatCurrency, formatDate } from '../../utils/formatters';

// Componente personalizado para o progresso de extração
const ExtractionProgress = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const ImportarContratos = () => {
  // Estados
  const [documentos, setDocumentos] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocuments, setProcessedDocuments] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Definição das etapas
  const steps = ['Selecionar Arquivos', 'Processar e Verificar', 'Importar Dados'];
  
  // Manipuladores
  const handleNext = () => {
    if (activeStep === 1) {
      handleImport();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
      
      if (activeStep === 0) {
        handleProcess();
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    
    if (activeStep === 2) {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    // Navegação para a página de contratos
    window.location.href = '/contratos';
  };
  
  const handleProcess = () => {
    // Simulação de processamento de documentos PDF
    setIsProcessing(true);
    
    // Simulando o progresso de extração
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgressValue(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Dados simulados extraídos dos PDFs
        const extractedData = documentos.map((doc, index) => ({
          id: `temp-${index}`,
          nomeArquivo: doc.name,
          clienteNome: `Cliente ${index + 1}`,
          loteInfo: `Lote ${(index + 10) * 2}, Quadra ${index + 1}`,
          dataContrato: new Date(2023, index % 12, (index % 28) + 1).toISOString().split('T')[0],
          valorTotal: 50000 + (index * 5000),
          parcelas: 36 + (index % 24),
          status: index % 2 === 0 ? 'Extraído com sucesso' : 'Dados parciais',
          confianca: index % 2 === 0 ? 95 : 75
        }));
        
        setProcessedDocuments(extractedData);
        setIsProcessing(false);
        
        // Notificação de sucesso
        setNotification({
          open: true,
          message: 'Processamento concluído. Verifique os dados extraídos.',
          severity: 'success'
        });
      }
    }, 200);
  };
  
  const handleImport = () => {
    // Simulação de importação para o banco de dados
    setIsProcessing(true);
    
    // Simulando o progresso de importação
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgressValue(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
        setActiveStep(3); // Etapa final
        
        // Notificação de sucesso
        setNotification({
          open: true,
          message: 'Contratos importados com sucesso!',
          severity: 'success'
        });
      }
    }, 300);
  };
  
  // Conteúdo baseado na etapa atual
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Selecionar Arquivos
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Selecione os Contratos em PDF para Importação
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              A importação de contratos irá utilizar IA para extrair dados de documentos PDF.
              Certifique-se de que os arquivos estão legíveis e em formato adequado.
            </Alert>
            
            <FileUpload
              label="Selecione os arquivos de contrato"
              value={documentos}
              onChange={setDocumentos}
              maxFiles={10}
              acceptedFileTypes=".pdf"
            />
          </Box>
        );
      
      case 1: // Processar e Verificar
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Processamento e Verificação
            </Typography>
            
            {isProcessing ? (
              <ExtractionProgress>
                <Typography variant="body1" gutterBottom>
                  Processando documentos... Por favor, aguarde.
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progressValue} 
                  sx={{ mb: 1 }} 
                />
                <Typography variant="caption" color="textSecondary">
                  {progressValue}% Completo
                </Typography>
              </ExtractionProgress>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Verifique os dados extraídos e faça ajustes se necessário antes de importar.
                </Alert>
                
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Arquivo</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Lote</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Valor</TableCell>
                        <TableCell>Parcelas</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {processedDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.nomeArquivo}</TableCell>
                          <TableCell>{doc.clienteNome}</TableCell>
                          <TableCell>{doc.loteInfo}</TableCell>
                          <TableCell>{formatDate(doc.dataContrato)}</TableCell>
                          <TableCell>{formatCurrency(doc.valorTotal)}</TableCell>
                          <TableCell>{doc.parcelas}x</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {doc.confianca >= 90 ? (
                                <CheckIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                              ) : (
                                <ErrorIcon fontSize="small" color="warning" sx={{ mr: 1 }} />
                              )}
                              <Typography variant="body2" color={doc.confianca >= 90 ? 'success.main' : 'warning.main'}>
                                {doc.status} ({doc.confianca}%)
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        );
      
      case 2: // Importar Dados
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Importação em Progresso
            </Typography>
            
            <ExtractionProgress>
              <Typography variant="body1" gutterBottom>
                Importando contratos para o sistema... Por favor, aguarde.
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progressValue} 
                sx={{ mb: 1 }} 
              />
              <Typography variant="caption" color="textSecondary">
                {progressValue}% Completo
              </Typography>
            </ExtractionProgress>
          </Box>
        );
      
      case 3: // Finalizado
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Importação Concluída
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              {processedDocuments.length} contratos foram importados com sucesso!
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resumo da Importação
                  </Typography>
                  <Typography variant="body2">
                    Total de arquivos processados: {documentos.length}
                  </Typography>
                  <Typography variant="body2">
                    Contratos importados com sucesso: {processedDocuments.length}
                  </Typography>
                  <Typography variant="body2">
                    Contratos com dados incompletos: {processedDocuments.filter(d => d.confianca < 90).length}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.href = '/contratos'}
              >
                Ir para Gerenciamento de Contratos
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return 'Etapa desconhecida';
    }
  };
  
  return (
    <Box>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Importar Contratos em PDF
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        {activeStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={activeStep === 0 ? handleCancel : handleBack}
              disabled={isProcessing}
            >
              {activeStep === 0 ? 'Cancelar' : 'Voltar'}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={activeStep === 0 ? <UploadIcon /> : <SaveIcon />}
              onClick={handleNext}
              disabled={isProcessing || (activeStep === 0 && documentos.length === 0)}
            >
              {activeStep === 0 ? 'Processar' : activeStep === 1 ? 'Importar' : 'Finalizar'}
            </Button>
          </Box>
        )}
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportarContratos;