// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { SnackbarProvider } from 'notistack';

import ThemeProvider from './ThemeProvider';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';
import ListaClientes from './pages/clientes/ListaClientes';
import CadastroCliente from './pages/clientes/CadastroCliente';
import EditarCliente from './pages/clientes/EditarCliente';
import ListaContratos from './pages/contratos/ListaContratos';
import CadastroContrato from './pages/contratos/CadastroContrato';
import EditarContrato from './pages/contratos/EditarContrato';
import VincularContratosPage from './pages/contratos/VincularContratosPage';
import ImportarContratosPage from './pages/contratos/ImportarContratosPage';
import DocumentosPage from './pages/documentos/DocumentosPage';
import AditivoPage from './pages/documentos/AditivoPage';
import DistratoPage from './pages/documentos/DistratoPage';
import QuitacaoPage from './pages/documentos/QuitacaoPage';
import GerenciarBoletos from './pages/boletos/GerenciarBoletos';
import BoletosDetails from './pages/boletos/BoletosDetails';
import EmitirBoletos from './pages/boletos/EmitirBoletos';
import GerenciadorArquivos from './pages/boletos/GerenciadorArquivos';
import NotFound from './pages/NotFound';
import { ClienteProvider } from './contexts/ClienteContext';
import { ContratoProvider } from './contexts/ContratoContext';
import { BoletoProvider } from './contexts/BoletoContext';
import { DocumentosContratuaisProvider } from './contexts/DocumentosContratuaisContext';
import { ReajusteProvider } from './contexts/ReajusteContext';
import { InadimplenciaProvider } from './contexts/InadimplenciaContext';
import ReajustesPage from './pages/reajustes/ReajustesPage';
import ConfiguracaoReajustesPage from './pages/reajustes/ConfiguracaoReajustesPage';
import InadimplenciaPage from './pages/inadimplencia/InadimplenciaPage';
import ConfiguracaoInadimplenciaPage from './pages/inadimplencia/ConfiguracaoInadimplenciaPage';

function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          autoHideDuration={4000}
        >
          <ClienteProvider>
            <ContratoProvider>
              <BoletoProvider>
                <DocumentosContratuaisProvider>
                  <ReajusteProvider>
                    <InadimplenciaProvider>
                      <Routes>
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Home />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          
                          {/* Rotas de Clientes */}
                          <Route path="clientes">
                            <Route index element={<ListaClientes />} />
                            <Route path="cadastro" element={<CadastroCliente />} />
                            <Route path="editar/:id" element={<EditarCliente />} />
                          </Route>
                          
                          {/* Rotas de Contratos */}
                          <Route path="contratos">
                            <Route index element={<ListaContratos />} />
                            <Route path="cadastro" element={<CadastroContrato />} />
                            <Route path="editar/:id" element={<EditarContrato />} />
                            <Route path="vincular" element={<VincularContratosPage />} />
                            <Route path="importar" element={<ImportarContratosPage />} />
                            <Route path=":contratoId/documentos" element={<DocumentosPage />} />
                            <Route path=":contratoId/aditivos/:aditivoId" element={<AditivoPage />} />
                            <Route path=":contratoId/distratos/:distratoId" element={<DistratoPage />} />
                            <Route path=":contratoId/quitacao/:quitacaoId" element={<QuitacaoPage />} />
                          </Route>
                          
                          {/* Rotas de Boletos */}
                          <Route path="boletos">
                            <Route index element={<GerenciarBoletos />} />
                            <Route path=":id" element={<BoletosDetails />} />
                            <Route path="emitir" element={<EmitirBoletos />} />
                            <Route path="arquivos" element={<GerenciadorArquivos />} />
                          </Route>
                          
                          {/* Rotas de Reajustes */}
                          <Route path="reajustes">
                            <Route index element={<ReajustesPage />} />
                            <Route path="configuracao" element={<ConfiguracaoReajustesPage />} />
                          </Route>
                          
                          {/* Rotas de Inadimplência */}
                          <Route path="inadimplencia">
                            <Route index element={<InadimplenciaPage />} />
                            <Route path="configuracoes" element={<ConfiguracaoInadimplenciaPage />} />
                          </Route>
                          
                          {/* Rota 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </InadimplenciaProvider>
                  </ReajusteProvider>
                </DocumentosContratuaisProvider>
              </BoletoProvider>
            </ContratoProvider>
          </ClienteProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;