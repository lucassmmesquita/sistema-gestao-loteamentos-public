// src/pages/clientes/VisualizarCliente.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Description as DescriptionIcon } from '@mui/icons-material';
import useClientes from '../../hooks/useClientes';
import useContratos from '../../hooks/useContratos';
import { formatCPFouCNPJ, formatDate, formatTelefone } from '../../utils/formatters';
import Loading from '../../components/common/Loading';
import ContratoList from '../../components/contratos/ContratoList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cliente-tabpanel-${index}`}
      aria-labelledby={`cliente-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VisualizarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCliente, currentCliente, loading, error } = useClientes();
  const { loadContratosByCliente, loading: loadingContratos } = useContratos();
  const [loaded, setLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [contratos, setContratos] = useState([]);

  useEffect(() => {
    const fetchCliente = async () => {
      if (id) {
        await loadCliente(parseInt(id));
        setLoaded(true);
      }
    };

    fetchCliente();
  }, [id, loadCliente]);

  useEffect(() => {
    const fetchContratos = async () => {
      if (id) {
        const clienteContratos = await loadContratosByCliente(parseInt(id));
        setContratos(clienteContratos);
      }
    };

    fetchContratos();
  }, [id, loadContratosByCliente]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Loading open={loading || loadingContratos || !loaded} />

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/clientes')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2.125rem' }
          }}
        >
          Dados do Cliente
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loaded && !currentCliente && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Cliente não encontrado. Verifique se o ID está correto.
        </Alert>
      )}

      {loaded && currentCliente && (
        <>
          <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {currentCliente.nome}
                </Typography>
                <Typography color="text.secondary">
                  {formatCPFouCNPJ(currentCliente.cpfCnpj)}
                </Typography>
              </Box>

              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Informações Pessoais" />
                <Tab label={`Contratos (${contratos.length})`} />
                <Tab label={`Documentos (${currentCliente.documentos?.length || 0})`} />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Dados Pessoais
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Nome
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {currentCliente.nome}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            CPF/CNPJ
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatCPFouCNPJ(currentCliente.cpfCnpj)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Data de Nascimento
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {formatDate(currentCliente.dataNascimento) || 'Não informado'}
                          </Typography>
                        </Grid>
                        
                        {currentCliente.profissao && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Profissão
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.profissao}
                            </Typography>
                          </Grid>
                        )}
                        
                        {currentCliente.nomeConjuge && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Nome do Cônjuge
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.nomeConjuge}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        Contatos
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {currentCliente.contatos && (
                        <Grid container spacing={2}>
                          {currentCliente.contatos.telefones && currentCliente.contatos.telefones.map((telefone, index) => (
                            <Grid item xs={12} sm={6} key={`telefone-${index}`}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Telefone {index + 1}
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                {formatTelefone(telefone)}
                              </Typography>
                            </Grid>
                          ))}
                          
                          {currentCliente.contatos.emails && currentCliente.contatos.emails.map((email, index) => (
                            <Grid item xs={12} sm={6} key={`email-${index}`}>
                              <Typography variant="subtitle2" color="text.secondary">
                                E-mail {index + 1}
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                {email}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      {(!currentCliente.contatos || 
                         (!currentCliente.contatos.telefones?.length && 
                          !currentCliente.contatos.emails?.length)) && (
                        <Typography variant="body1" color="text.secondary">
                          Nenhum contato cadastrado.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Endereço
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {currentCliente.endereco ? (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={8}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Logradouro
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {`${currentCliente.endereco.logradouro}, ${currentCliente.endereco.numero}${currentCliente.endereco.complemento ? ` - ${currentCliente.endereco.complemento}` : ''}`}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Bairro
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.endereco.bairro}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Cidade
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.endereco.cidade}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Estado
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.endereco.estado}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                              CEP
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              {currentCliente.endereco.cep}
                            </Typography>
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          Nenhum endereço cadastrado.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {contratos.length > 0 ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Contratos vinculados a este cliente:
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <ContratoList clienteId={parseInt(id)} mode="embedded" />
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Este cliente não possui contratos.
                  </Typography>
                )}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {currentCliente.documentos && currentCliente.documentos.length > 0 ? (
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Documentos do Cliente
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List dense>
                      {currentCliente.documentos.map((doc) => (
                        <ListItem key={doc.id} button component="a" href={doc.url} target="_blank" rel="noopener noreferrer">
                          <ListItemIcon>
                            <DescriptionIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={doc.nomeArquivo}
                            secondary={`Tipo: ${doc.tipoDocumento} - Data de Upload: ${formatDate(doc.dataUpload)}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Nenhum documento cadastrado para este cliente.
                  </Typography>
                )}
              </TabPanel>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default VisualizarCliente;