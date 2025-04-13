import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ClienteProvider>
      <ContratoProvider>
        <BoletoProvider>
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
              </Route>
              
              {/* Rotas de Boletos */}
              <Route path="boletos">
                <Route index element={<GerenciarBoletos />} />
                <Route path=":id" element={<BoletosDetails />} />
                <Route path="emitir" element={<EmitirBoletos />} />
                <Route path="arquivos" element={<GerenciadorArquivos />} />
              </Route>
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BoletoProvider>
      </ContratoProvider>
    </ClienteProvider>
  );
}

export default App;