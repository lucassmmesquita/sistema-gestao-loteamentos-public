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

const ImportarClientes = () => {
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
            let dataNascimento;
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
              
              dataNascimento = formatDate(row.data_nascimento);
            } catch (error) {
              console.error('Erro ao converter datas:', error);
              dataNascimento = null;
            }
            
            return {
              idCliente: Number(row.IDCliente || 0),
              nomeComprador: String(row.nome_comprador || ''),
              nomeConjuge: String(row.nome_conjuge || ''),
              profissao: String(row.profissao || ''),
              dataNascimento,
              numeroLote: Number(row.numero_lote || 0),
              quadraLote: Number(row.quadra_lote || 0),
              areaLote: Number(row.area_lote || 0),
              bairro: String(row.bairro || ''),
              estado: String(row.estado || ''),
              cep: String(row.cep || ''),
              enderecoCliente: String(row.endereco_cliente || '')
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
      const response = await api.post('/clientes/import', data);
      setResult(response.data);
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      setError('Erro ao importar clientes. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Importar Clientes da Planilha
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
            id="upload-clientes-file"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="upload-clientes-file">
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
                    <TableCell>ID Cliente</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Cônjuge</TableCell>
                    <TableCell>Profissão</TableCell>
                    <TableCell>Data Nascimento</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.idCliente}</TableCell>
                      <TableCell>{row.nomeComprador}</TableCell>
                      <TableCell>{row.nomeConjuge}</TableCell>
                      <TableCell>{row.profissao}</TableCell>
                      <TableCell>{row.dataNascimento}</TableCell>
                      <TableCell>{row.estado}</TableCell>
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
                'Importar Clientes'
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
                        <TableCell>ID Cliente</TableCell>
                        <TableCell>Erro</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.results
                        .filter(r => r.status === 'error')
                        .map((error, index) => (
                          <TableRow key={index}>
                            <TableCell>{error.idCliente}</TableCell>
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

export default ImportarClientes;