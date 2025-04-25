// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Providers
import { AuthProvider } from './contexts/AuthContext';
import { ClienteProvider } from './contexts/ClienteContext';
import { ContratoProvider } from './contexts/ContratoContext';
import { BoletoProvider } from './contexts/BoletoContext';
import { DocumentosContratuaisProvider } from './contexts/DocumentosContratuaisContext';
import { ReajusteProvider } from './contexts/ReajusteContext';
import { InadimplenciaProvider } from './contexts/InadimplenciaContext';
import { LoteProvider } from './contexts/LoteContext'; // Nova importação

// Componentes de layout e autenticação
import Layout from './components/common/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Páginas de autenticação
import Login from './pages/auth/Login';
import AccessDenied from './pages/auth/AccessDenied';
import ForgotPassword from './pages/auth/ForgotPassword';

// Páginas de usuários
import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

// Páginas existentes
import Home from './pages/Home';
import Dashboard from './pages/dashboard/Dashboard';

// Páginas de clientes
import ListaClientes from './pages/clientes/ListaClientes';
import CadastroCliente from './pages/clientes/CadastroCliente';
import EditarCliente from './pages/clientes/EditarCliente';

// Páginas de contratos
import ListaContratos from './pages/contratos/ListaContratos';
import CadastroContrato from './pages/contratos/CadastroContrato';
import EditarContrato from './pages/contratos/EditarContrato';
import VincularContratosPage from './pages/contratos/VincularContratosPage';
import ImportarContratosPage from './pages/contratos/ImportarContratosPage';

// Páginas de documentos
import DocumentosPage from './pages/documentos/DocumentosPage';
import AditivoPage from './pages/documentos/AditivoPage';
import DistratoPage from './pages/documentos/DistratoPage';
import QuitacaoPage from './pages/documentos/QuitacaoPage';

// Páginas de boletos
import GerenciarBoletos from './pages/boletos/GerenciarBoletos';
import BoletosDetails from './pages/boletos/BoletosDetails';
import EmitirBoletos from './pages/boletos/EmitirBoletos';
import GerenciadorArquivos from './pages/boletos/GerenciadorArquivos';

// Páginas de reajustes
import ReajustesPage from './pages/reajustes/ReajustesPage';
import ConfiguracaoReajustesPage from './pages/reajustes/ConfiguracaoReajustesPage';

// Páginas de inadimplência
import InadimplenciaPage from './pages/inadimplencia/InadimplenciaPage';
import ConfiguracaoInadimplenciaPage from './pages/inadimplencia/ConfiguracaoInadimplenciaPage';

// Página 404
import NotFound from './pages/NotFound';

import ImportarLotesPage from './pages/lotes/ImportarLotesPage';
import ImportarClientesPage from './pages/clientes/ImportarClientesPage';
import ListaLotes from './pages/lotes/ListaLotes';
import CadastroLote from './pages/lotes/CadastroLote';
import EditarLote from './pages/lotes/EditarLote';

// Tema da aplicação
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ClienteProvider>
          <ContratoProvider>
            <LoteProvider> {/* Novo provider adicionado */}
              <BoletoProvider>
                <DocumentosContratuaisProvider>
                  <ReajusteProvider>
                    <InadimplenciaProvider>
                      <Routes>
                        {/* Rotas públicas */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/esqueci-senha" element={<ForgotPassword />} />
                        <Route path="/acesso-negado" element={<AccessDenied />} />
                        <Route path="/contato" element={<NotFound />} />
                        
                        {/* Rotas privadas */}
                        <Route path="/" element={
                          <PrivateRoute>
                            <Layout />
                          </PrivateRoute>
                        }>
                          <Route index element={<Dashboard />} />
                          
                          {/* Rotas de Usuários */}
                          <Route path="usuarios">
                            <Route index element={
                              <PrivateRoute permissions={['users:view']}>
                                <UserList />
                              </PrivateRoute>
                            } />
                            <Route path="novo" element={
                              <PrivateRoute permissions={['users:create']}>
                                <UserForm />
                              </PrivateRoute>
                            } />
                            <Route path="editar/:userId" element={
                              <PrivateRoute permissions={['users:edit']}>
                                <UserForm />
                              </PrivateRoute>
                            } />
                            <Route path="detalhes/:userId" element={
                              <PrivateRoute permissions={['users:view']}>
                                <UserForm />
                              </PrivateRoute>
                            } />
                          </Route>
                          
                          {/* Rotas de Clientes */}
                          <Route path="clientes">
                          <Route path="importar" element={
                              <PrivateRoute permissions={['clients:create']}>
                                <ImportarClientesPage />
                              </PrivateRoute>
                            } />
                            <Route index element={
                              <PrivateRoute permissions={['clients:view']}>
                                <ListaClientes />
                              </PrivateRoute>
                            } />
                            <Route path="cadastro" element={
                              <PrivateRoute permissions={['clients:create']}>
                                <CadastroCliente />
                              </PrivateRoute>
                            } />
                            <Route path="editar/:id" element={
                              <PrivateRoute permissions={['clients:edit']}>
                                <EditarCliente />
                              </PrivateRoute>
                            } />
                          </Route>
                          
                          {/* Rotas de Contratos */}
                          <Route path="contratos">
                          <Route path="importar" element={
                              <PrivateRoute permissions={['contracts:create']}>
                                <ImportarContratosPage />
                              </PrivateRoute>
                            } />
                            <Route index element={
                              <PrivateRoute permissions={['contracts:view']}>
                                <ListaContratos />
                              </PrivateRoute>
                            } />
                            <Route path="cadastro" element={
                              <PrivateRoute permissions={['contracts:create']}>
                                <CadastroContrato />
                              </PrivateRoute>
                            } />
                            <Route path="editar/:id" element={
                              <PrivateRoute permissions={['contracts:edit']}>
                                <EditarContrato />
                              </PrivateRoute>
                            } />
                            <Route path="vincular" element={
                              <PrivateRoute permissions={['contracts:create']}>
                                <VincularContratosPage />
                              </PrivateRoute>
                            } />
                            <Route path="importar" element={
                              <PrivateRoute permissions={['contracts:create']}>
                                <ImportarContratosPage />
                              </PrivateRoute>
                            } />
                            <Route path=":contratoId/documentos" element={
                              <PrivateRoute permissions={['contracts:view']}>
                                <DocumentosPage />
                              </PrivateRoute>
                            } />
                            <Route path=":contratoId/aditivos/:aditivoId" element={
                              <PrivateRoute permissions={['contracts:edit']}>
                                <AditivoPage />
                              </PrivateRoute>
                            } />
                            <Route path=":contratoId/distratos/:distratoId" element={
                              <PrivateRoute permissions={['contracts:edit']}>
                                <DistratoPage />
                              </PrivateRoute>
                            } />
                            <Route path=":contratoId/quitacao/:quitacaoId" element={
                              <PrivateRoute permissions={['contracts:edit']}>
                                <QuitacaoPage />
                              </PrivateRoute>
                            } />
                          </Route>
                            {/* Rotas de Lotes */}
                          <Route path="lotes">
                            <Route index element={
                                <PrivateRoute permissions={['lots:view']}>
                                  <ListaLotes />
                                </PrivateRoute>
                              } />
                              <Route path="cadastro" element={
                                <PrivateRoute permissions={['lots:create']}>
                                  <CadastroLote />
                                </PrivateRoute>
                              } />
                              <Route path="editar/:id" element={
                                <PrivateRoute permissions={['lots:edit']}>
                                  <EditarLote />
                                </PrivateRoute>
                              } />
                            <Route path="importar" element={
                              <PrivateRoute permissions={['lots:create']}>
                                <ImportarLotesPage />
                              </PrivateRoute>
                            } />
                          </Route>
                          {/* Rotas de Boletos */}
                          <Route path="boletos">
                            <Route index element={
                              <PrivateRoute permissions={['invoices:view']}>
                                <GerenciarBoletos />
                              </PrivateRoute>
                            } />
                            <Route path=":id" element={
                              <PrivateRoute permissions={['invoices:view']}>
                                <BoletosDetails />
                              </PrivateRoute>
                            } />
                            <Route path="emitir" element={
                              <PrivateRoute permissions={['invoices:create']}>
                                <EmitirBoletos />
                              </PrivateRoute>
                            } />
                            <Route path="arquivos" element={
                              <PrivateRoute permissions={['invoices:manage']}>
                                <GerenciadorArquivos />
                              </PrivateRoute>
                            } />
                          </Route>
                          
                          {/* Rotas de Reajustes */}
                          <Route path="reajustes">
                            <Route index element={
                              <PrivateRoute permissions={['contracts:view']}>
                                <ReajustesPage />
                              </PrivateRoute>
                            } />
                            <Route path="configuracao" element={
                              <PrivateRoute permissions={['settings:manage']}>
                                <ConfiguracaoReajustesPage />
                              </PrivateRoute>
                            } />
                          </Route>
                          
                          {/* Rotas de Inadimplência */}
                          <Route path="inadimplencia">
                            <Route index element={
                              <PrivateRoute permissions={['invoices:view']}>
                                <InadimplenciaPage />
                              </PrivateRoute>
                            } />
                            <Route path="configuracoes" element={
                              <PrivateRoute permissions={['settings:manage']}>
                                <ConfiguracaoInadimplenciaPage />
                              </PrivateRoute>
                            } />
                          </Route>
                          
                          {/* Rota 404 */}
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </InadimplenciaProvider>
                  </ReajusteProvider>
                </DocumentosContratuaisProvider>
              </BoletoProvider>
            </LoteProvider>
          </ContratoProvider>
        </ClienteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;