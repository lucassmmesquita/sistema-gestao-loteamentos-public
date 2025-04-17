// Definição dos níveis de acesso do sistema
const ROLES = {
    ADMIN: {
      id: 'admin',
      name: 'Administrador',
      description: 'Acesso completo ao sistema',
      permissions: [
        'users:manage', 'users:view', 'users:create', 'users:edit', 'users:delete',
        'clients:manage', 'clients:view', 'clients:create', 'clients:edit', 'clients:delete',
        'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit', 'contracts:delete',
        'lots:manage', 'lots:view', 'lots:create', 'lots:edit', 'lots:delete',
        'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit', 'invoices:delete',
        'reports:manage', 'reports:view', 'reports:create',
        'settings:manage', 'settings:view'
      ]
    },
    SUPERVISOR: {
      id: 'supervisor',
      name: 'Supervisor',
      description: 'Acesso para gerenciar operações, sem acesso a configurações avançadas',
      permissions: [
        'users:view',
        'clients:manage', 'clients:view', 'clients:create', 'clients:edit',
        'contracts:manage', 'contracts:view', 'contracts:create', 'contracts:edit',
        'lots:view',
        'invoices:manage', 'invoices:view', 'invoices:create', 'invoices:edit',
        'reports:view', 'reports:create',
        'settings:view'
      ]
    },
    OPERATOR: {
      id: 'operator',
      name: 'Operador',
      description: 'Acesso limitado para operações do dia a dia',
      permissions: [
        'clients:view',
        'contracts:view',
        'lots:view',
        'invoices:view', 'invoices:create',
        'reports:view'
      ]
    }
  };
  
  // Verifica se o usuário tem a permissão especificada
  export const hasPermission = (user, permission) => {
    if (!user || !user.role) return false;
    
    // Se o usuário é administrador, concede todas as permissões
    if (user.role === ROLES.ADMIN.id) return true;
    
    const rolePermissions = ROLES[user.role.toUpperCase()]?.permissions || [];
    return rolePermissions.includes(permission);
  };
  
  // Lista todos os perfis disponíveis
  export const getAllRoles = () => {
    return Object.values(ROLES);
  };
  
  // Obtém um perfil pelo ID
  export const getRoleById = (roleId) => {
    return ROLES[roleId.toUpperCase()] || null;
  };
  
  export default ROLES;