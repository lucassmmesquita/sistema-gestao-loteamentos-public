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

const ImportarContratos = () => {
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
          const mappedData = json.map(row => {
            // Convertendo datas
            let dataEmissao, dataPrimeiraPrestacao;
            try {
              // Tenta converter datas para o formato esperado
              const formatDate = (excelDate) => {
                if (!excelDate) return null;
                
                // Verificar se é um número do Excel (dias desde 1900-01-01)
                if (typeof excelDate === 'number') {
                  return new Date(Math.round((excelDate - 25569) * 86400 * 1000)).toISOString().split('T')[0];
                }
                
                // Formatos possíveis: DD/MM/YYYY ou YYYY-MM-DD
                if (typeof excelDate === 'string') {
                  if (excelDate.includes('/')) {
                    const [day, month, year] = excelDate.split('/');
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                  }
                  return excelDate;
                }
                
                return null;
              };
              
              dataEmissao = formatDate(row.data_emissao);
              dataPrimeiraPrestacao = formatDate(row.data_primeira_prestacao);
            } catch (error) {
              console.error('Erro ao converter datas:', error);
              dataEmissao = null;
              dataPrimeiraPrestacao = null;
            }
            
            return {
              chave: String(row.chave || ''),
              numeroContrato: String(row.numero_contrato || ''),
              dataEmissao,
              valorContrato: Number(row.valor_contrato || 0),
              numeroParcelas: Number(row.numero_parcelas || 0),
              dataPrimeiraPrestacao,
              valorPrestacao: Number(row.valor_prestacao || 0),
              idCliente: Number(row.IDCliente || 0),
              numeroLote: Number(row.numero_lote || 0),
              quadraLote: Number(row.quadra_lote || 0),
              areaLote: Number(row.area_lote || 0),
            };
          });
          
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
      const response = await api.post('/contratos/import', data);
      setResult(response.data);
    } catch (error) {
      console.error('Erro ao importar contratos:', error);
      setError('Erro ao importar contratos. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Importar Contratos da Planilha
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
            id="upload-contratos-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="upload-contratos-file">
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
                    <TableCell>Chave</TableCell>
                    <TableCell>Número Contrato</TableCell>
                    <TableCell>Cliente ID</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Parcelas</TableCell>
                    <TableCell>Data Emissão</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.chave}</TableCell>
                      <TableCell>{row.numeroContrato}</TableCell>
                      <TableCell>{row.idCliente}</TableCell>
                      <TableCell>{row.valorContrato}</TableCell>
                      <TableCell>{row.numeroParcelas}</TableCell>
                      <TableCell>{row.dataEmissao}</TableCell>
                    </TableRow>
                  ))}
                  {data.length > 10 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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
                'Importar Contratos'
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
                        <TableCell>Contrato</TableCell>
                        <TableCell>Erro</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.results
                        .filter(r => r.status === 'error')
                        .map((error, index) => (
                            <TableRow key={index}>
                            <TableCell>{error.numeroContrato}</TableCell>
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

export default ImportarContratos;