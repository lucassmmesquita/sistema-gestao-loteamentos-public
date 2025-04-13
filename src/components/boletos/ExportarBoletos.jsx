import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import useBoletos from '../../hooks/useBoletos';

/**
 * Componente para exportação de boletos para Excel ou PDF
 * Este é um componente simplificado para resolver o erro de compilação
 */
const ExportarBoletos = ({ open, onClose, boletos = null }) => {
  const { filteredBoletos } = useBoletos();
  
  // Estado para as opções de exportação
  const [opcoes, setOpcoes] = useState({
    formato: 'excel',
    nomeArquivo: 'boletos_export',
    incluirCabecalho: true,
    incluirTotais: true,
    apenasVisiveis: true
  });
  
  // Manipula mudanças nas opções
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setOpcoes(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };
  
  // Manipula a exportação
  const handleExportar = () => {
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Exportar Boletos
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Opções de Exportação
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Formato</InputLabel>
              <Select
                name="formato"
                value={opcoes.formato}
                label="Formato"
                onChange={handleChange}
              >
                <MenuItem value="excel">Excel (XLSX)</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Nome do Arquivo"
              name="nomeArquivo"
              value={opcoes.nomeArquivo}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              helperText={`O arquivo será salvo como ${opcoes.nomeArquivo}.${opcoes.formato === 'excel' ? 'xlsx' : 'pdf'}`}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Conteúdo
            </Typography>
            
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={opcoes.incluirCabecalho}
                    onChange={handleChange}
                    name="incluirCabecalho"
                  />
                }
                label="Incluir cabeçalho"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={opcoes.incluirTotais}
                    onChange={handleChange}
                    name="incluirTotais"
                  />
                }
                label="Incluir totais"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={opcoes.apenasVisiveis}
                    onChange={handleChange}
                    name="apenasVisiveis"
                  />
                }
                label="Exportar apenas boletos visíveis (com filtros aplicados)"
              />
            </FormGroup>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total de boletos a exportar: <strong>{(boletos || filteredBoletos || []).length}</strong>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleExportar}
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
        >
          Exportar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportarBoletos;