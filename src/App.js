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
import GerenciarBoletos from './pages/boletos/GerenciarBoletos';
import BoletosDetails from './pages/boletos/BoletosDetails';
import EmitirBoletos from './pages/boletos/EmitirBoletos';
import GerenciadorArquivos from './pages/boletos/GerenciadorArquivos';
import NotFound from './pages/NotFound';
import { ClienteProvider } from './contexts/ClienteContext';
import { ContratoProvider } from './contexts/ContratoContext';
import { BoletoProvider } from './contexts/BoletoContext';

import { ReajusteProvider } from './contexts/ReajusteContext';
import ReajustesPage from './pages/reajustes/ReajustesPage';
import ConfiguracaoReajustesPage from './pages/reajustes/ConfiguracaoReajustesPage';

// Module 4: Inadimplência
import { InadimplenciaProvider } from './contexts/InadimplenciaContext';
import InadimplenciaPage from './pages/inadimplencia/InadimplenciaPage';
import DetalheClienteInadimplente from './pages/inadimplencia/DetalheClienteInadimplente';
import ConfiguracaoGatilhos from './pages/inadimplencia/ConfiguracaoGatilhos';

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
                <ReajusteProvider>
                  <InadimplenciaProvider>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        
                        {/* Client Routes */}
                        <Route path="clientes">
                          <Route index element={<ListaClientes />} />
                          <Route path="cadastro" element={<CadastroCliente />} />
                          <Route path="editar/:id" element={<EditarCliente />} />
                        </Route>
                        
                        {/* Contract Routes */}
                        <Route path="contratos">
                          <Route index element={<ListaContratos />} />
                          <Route path="cadastro" element={<CadastroContrato />} />
                          <Route path="editar/:id" element={<EditarContrato />} />
                        </Route>
                        
                        {/* Bills Routes */}
                        <Route path="boletos">
                          <Route index element={<GerenciarBoletos />} />
                          <Route path=":id" element={<BoletosDetails />} />
                          <Route path="emitir" element={<EmitirBoletos />} />
                          <Route path="arquivos" element={<GerenciadorArquivos />} />
                        </Route>

                        {/* Adjustments Routes */}
                        <Route path="reajustes">
                          <Route index element={<ReajustesPage />} />
                          <Route path="configuracao" element={<ConfiguracaoReajustesPage />} />
                        </Route>
                        
                        {/* Delinquency Management Routes */}
                        <Route path="inadimplencia">
                          <Route index element={<InadimplenciaPage />} />
                          <Route path="cliente/:clienteId" element={<DetalheClienteInadimplente />} />
                          <Route path="configuracoes" element={<ConfiguracaoGatilhos />} />
                          <Route path="relatorios" element={<InadimplenciaPage />} /> {/* Redirects to main page for now */}
                        </Route>
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </InadimplenciaProvider>
                </ReajusteProvider>
              </BoletoProvider>
            </ContratoProvider>
          </ClienteProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;