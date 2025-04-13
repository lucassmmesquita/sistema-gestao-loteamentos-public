import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeamento de rotas para nomes mais amigáveis
  const routeNameMap = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    cadastro: 'Cadastro',
    editar: 'Editar',
    contratos: 'Contratos',
    boletos: 'Boletos',
    emitir: 'Emitir',
    arquivos: 'Gerenciador de Arquivos',
    reajustes: 'Reajustes',
    configuracao: 'Configuração',
    inadimplencia: 'Inadimplência',
    'acoes-cobranca': 'Ações de Cobrança',
    gatilhos: 'Gatilhos Automáticos'
  };

  // Para alguns casos especiais onde queremos exibir algo diferente baseado na rota completa
  const getSpecialRouteNames = (path) => {
    const routes = {
      '/inadimplencia': 'Dashboard de Inadimplência',
      '/inadimplencia/clientes': 'Clientes Inadimplentes'
    };
    
    return routes[path] || null;
  };

  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="breadcrumb"
      sx={{ mb: 3, mt: 1 }}
    >
      <Link component={RouterLink} to="/" color="inherit">
        Home
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        
        // Verificar se esta rota tem um nome especial baseado no caminho completo
        const specialName = getSpecialRouteNames(to);
        
        // Se for o último item e tiver um nome especial, use-o
        if (last && specialName) {
          return (
            <Typography key={to} color="text.primary">
              {specialName}
            </Typography>
          );
        }
        
        // Nome amigável para a rota atual ou o valor original
        const routeName = routeNameMap[value] || value;
        
        return last ? (
          <Typography key={to} color="text.primary">
            {routeName}
          </Typography>
        ) : (
          <Link
            key={to}
            component={RouterLink}
            to={to}
            color="inherit"
          >
            {routeName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;