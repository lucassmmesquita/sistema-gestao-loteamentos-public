// src/components/contratos/AditivoContratual.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { formatDate, formatCurrency } from '../../utils/formatters';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

const UploadInput = styled('input')({
  display: 'none',
});

const AditivoContratual = ({ contratoId }) => {
  const [aditivos, setAditivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'alteracao_valor',
    motivoAditivo: '',
    novoValor: '',
    novaDataFim: '',
    file: null
  });
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const { isLoteadora, isVendedor, canEditContrato } = useAuth();
  
  // Carregar aditivos do contrato
  useEffect(() => {
    const fetchAditivos = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/contratos/${contratoId}/aditivos`);
        setAditivos(response.data);
      } catch (error) {
        console.error('Erro ao carregar aditivos:', error);
        setNotification({
          open: true,
          message: 'Erro ao carregar aditivos do contrato',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAditivos();
  }, [contratoId]);
  
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  
  const handleCloseForm = () => {
    setOpenForm(false);
    setFormData({
      tipo: 'alteracao_valor',
      motivoAditivo: '',
      novoValor: '',
      novaDataFim: '',
      file: null
    });
    setPreview(null);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        file
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setNotification({
        open: true,
        message: 'Por favor, selecione um arquivo PDF válido',
        severity: 'error'
      });
    }
  };
  
  const handleSubmit = async () => {
    if (!formData.motivoAditivo) {
      setNotification({
        open: true,
        message: 'Por favor, preencha o motivo do aditivo',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    try {
      // Upload do arquivo do aditivo
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('contratoId', contratoId);
      uploadFormData.append('tipo', 'aditivo');
      
      const uploadResponse = await api.post('/uploads/documentos', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Criar o aditivo
      const aditivoData = {
        contratoId,
        tipo: formData.tipo,
        dataAssinatura: new Date().toISOString(),
        motivoAditivo: formData.motivoAditivo,
        documentoUrl: uploadResponse.data.fileUrl
      };
      
      if (formData.tipo === 'alteracao_valor' && formData.novoValor) {
        aditivoData.novoValor = parseFloat(formData.novoValor);
      }
      
      if (formData.tipo === 'prorrogacao' && formData.novaDataFim) {
        aditivoData.novaDataFim = formData.novaDataFim;
      }
      
      const response = await api.post('/contratos/aditivos', aditivoData);
      
      setAditivos(prev => [...prev, response.data]);
      
      setNotification({
        open: true,
        message: 'Aditivo cadastrado com sucesso! Aguardando aprovações.',
        severity: 'success'
      });
      
      handleCloseForm();
    } catch (error) {
      console.error('Erro ao cadastrar aditivo:', error);
      setNotification({
        open: true,
        message: `Erro ao cadastrar aditivo: ${error.message || 'Erro desconhecido'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAprovarAditivo = async (aditivoId, aprovar) => {
    setLoading(true);
    try {
      await api.patch(`/contratos/aditivos/${aditivoId}/aprovar`, {
        aprovado: aprovar
      });
      
      // Atualizar a lista de aditivos
      const response = await api.get(`/contratos/${contratoId}/aditivos`);
      setAditivos(response.data);
      
      setNotification({
        open: true,
        message: aprovar ? 'Aditivo aprovado com sucesso!' : 'Aditivo rejeitado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao processar aditivo:', error);
      setNotification({
        open: true,
        message: `Erro ao processar aditivo: ${error.message || 'Erro desconhecido'}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case 'pendente':
        return <Chip label="Pendente" color="warning" size="small" />;
      case 'aprovado':
        return <Chip label="Aprovado" color="success" size="small" />;
      case 'rejeitado':
        return <Chip label="Rejeitado" color="error" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };
  
  const getTipoAditivo = (tipo) => {
    switch (tipo) {
      case 'alteracao_valor':
        return 'Alteração de Valor';
      case 'prorrogacao':
        return 'Prorrogação de Prazo';
      case 'transferencia':
        return 'Transferência de Titularidade';
      case 'outros':
        return 'Outros';
      default:
        return tipo;
    }
  };
  
  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Aditivos Contratuais</Typography>
        
        {canEditContrato && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Novo Aditivo
          </Button>
        )}
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : aditivos.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Data Assinatura</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aditivos.map((aditivo) => (
                <TableRow key={aditivo.id}>
                  <TableCell>{getTipoAditivo(aditivo.tipo)}</TableCell>
                  <TableCell>{formatDate(aditivo.dataAssinatura)}</TableCell>
                  <TableCell>
                    <Tooltip title={aditivo.motivoAditivo}>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {aditivo.motivoAditivo}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{getStatusChip(aditivo.status)}</TableCell>
                  <TableCell align="right">
                    {aditivo.documentoUrl && (
                      <Tooltip title="Visualizar Documento">
                        <IconButton
                          size="small"
                          onClick={() => window.open(aditivo.documentoUrl, '_blank')}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {isLoteadora && aditivo.status === 'pendente' && (
                      <>
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          onClick={() => handleAprovarAditivo(aditivo.id, true)}
                          sx={{ mx: 1 }}
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleAprovarAditivo(aditivo.id, false)}
                        >
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Nenhum aditivo contratual cadastrado para este contrato.
          </Typography>
        </Paper>
      )}
      
      {/* Modal de Cadastro de Aditivo */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>Novo Aditivo Contratual</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Aditivo</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleFormChange}
                label="Tipo de Aditivo"
              >
                <MenuItem value="alteracao_valor">Alteração de Valor</MenuItem>
                <MenuItem value="prorrogacao">Prorrogação de Prazo</MenuItem>
                <MenuItem value="transferencia">Transferência de Titularidade</MenuItem>
                <MenuItem value="outros">Outros</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Motivo do Aditivo"
              name="motivoAditivo"
              value={formData.motivoAditivo}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
              required
            />
            
            {formData.tipo === 'alteracao_valor' && (
              <TextField
                label="Novo Valor do Contrato"
                name="novoValor"
                value={formData.novoValor}
                onChange={handleFormChange}
                fullWidth
                type="number"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <span>R$</span>
                }}
              />
            )}
            
            {formData.tipo === 'prorrogacao' && (
              <TextField
                label="Nova Data de Término"
                name="novaDataFim"
                value={formData.novaDataFim}
                onChange={handleFormChange}
                fullWidth
                type="date"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            
            <Typography variant="subtitle2" gutterBottom>
              Documento do Aditivo (PDF)
            </Typography>
            
            <label htmlFor="upload-aditivo">
              <UploadInput
                accept="application/pdf"
                id="upload-aditivo"
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Selecionar Documento
              </Button>
            </label>
            
            {formData.file && (
              <Typography variant="body2" gutterBottom>
                Arquivo selecionado: {formData.file.name}
              </Typography>
            )}
            
            {preview && (
              <Paper
                variant="outlined"
                sx={{
                  width: '100%',
                  height: 300,
                  overflow: 'hidden',
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <iframe
                  src={preview}
                  title="Prévia do PDF"
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                />
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!formData.motivoAditivo || !formData.file || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Cadastrar Aditivo
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default AditivoContratual;