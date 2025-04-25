import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import api from '../../services/api';

const ImportarLotes = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const json = XLSX.utils.sheet_to_json(ws);
          
          // Mapeamento dos campos da planilha para os campos da API
          const mappedData = json.map(row => ({
            quadra: Number(row.Quadras || 0),
            lote: Number(row.Lotes || 0),
            area: Number(row['Area m2'] || 0),
            chave: String(row.chave || ''),
          }));
          
          setData(mappedData);
          setError(null);
        } catch (error) {
          console.error('Erro ao processar o arquivo:', error);
          setError('Erro ao processar o arquivo. Verifique se o formato está correto.');
          setData([]);
        }
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      setData([]);
    }
  };
  
  const handleImport = async () => {
    if (!data.length) {
      setError('Não há dados para importar.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/lotes/import', data);
      setResult(response.data);
    } catch (error) {
      console.error('Erro ao importar lotes:', error);
      setError('Erro ao importar lotes. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Importar Lotes da Planilha
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <input
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            id="upload-lotes-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="upload-lotes-file">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
            >
              Selecionar Planilha
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Arquivo selecionado: {file.name}
            </Typography>
          )}
        </Box>
        
        {data.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dados para importação ({data.length} registros):
            </Typography>
            
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Quadra</TableCell>
                    <TableCell>Lote</TableCell>
                    <TableCell>Área (m²)</TableCell>
                    <TableCell>Chave</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.quadra}</TableCell>
                      <TableCell>{row.lote}</TableCell>
                      <TableCell>{row.area}</TableCell>
                      <TableCell>{row.chave}</TableCell>
                    </TableRow>
                  ))}
                  {data.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        ... mais {data.length - 10} registros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleImport}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Importando...
                </>
              ) : (
                'Importar Lotes'
              )}
            </Button>
          </Box>
        )}
        
        {result && (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              Importação concluída!
            </Alert>
            
            <Typography variant="subtitle1" gutterBottom>
              Resumo da importação:
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">
                Total de registros: {result.total}
              </Typography>
              <Typography variant="body2">
                Processados: {result.processed}
              </Typography>
              <Typography variant="body2">
                Criados: {result.results.filter(r => r.status === 'created').length}
              </Typography>
              <Typography variant="body2">
                Atualizados: {result.results.filter(r => r.status === 'updated').length}
              </Typography>
              <Typography variant="body2">
                Erros: {result.results.filter(r => r.status === 'error').length}
              </Typography>
            </Box>
            
            {result.results.filter(r => r.status === 'error').length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Erros na importação:
                </Typography>
                
                <TableContainer sx={{ maxHeight: 200 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Chave</TableCell>
                        <TableCell>Erro</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.results
                        .filter(r => r.status === 'error')
                        .map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.chave}</TableCell>
                            <TableCell>{error.error}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ImportarLotes;