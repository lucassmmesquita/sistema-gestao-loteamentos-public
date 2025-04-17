// src/pages/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  MoreVert,
  Refresh,
  CheckCircle,
  Cancel,
  Lock,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getRoleById } from '../../utils/roles';

// Componente de lista de usuários
const UserList = () => {
  const navigate = useNavigate();
  const { checkPermission } = useAuth();
  
  // Estados
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Verificar permissões
  const canCreateUsers = checkPermission('users:create');
  const canEditUsers = checkPermission('users:edit');
  const canDeleteUsers = checkPermission('users:delete');
  
  // Carregar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulando chamada API
        setTimeout(() => {
          const mockUsers = [
            { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: true, lastLogin: '2023-04-15T10:30:00Z' },
            { id: 2, name: 'Supervisor User', email: 'supervisor@example.com', role: 'supervisor', status: true, lastLogin: '2023-04-14T09:15:00Z' },
            { id: 3, name: 'Operator User', email: 'operator@example.com', role: 'operator', status: true, lastLogin: '2023-04-12T14:45:00Z' },
            { id: 4, name: 'Inactive User', email: 'inactive@example.com', role: 'operator', status: false, lastLogin: '2023-03-20T11:30:00Z' }
          ];
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erro ao carregar usuários');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filtrar usuários
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const searchLower = search.toLowerCase();
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      getRoleById(user.role)?.name.toLowerCase().includes(searchLower)
    );
    
    setFilteredUsers(filtered);
  }, [search, users]);
  
  // Handler para o campo de busca
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  
  // Abrir menu de ações
  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };
  
  // Fechar menu de ações
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };
  
  // Abrir diálogo de confirmação de exclusão
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };
  
  // Fechar diálogo de exclusão
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };
  
  // Confirmar exclusão
  const handleDeleteConfirm = async () => {
    try {
      // Simulando chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remover usuário da lista
      setUsers(prev => prev.filter(user => user.id !== selectedUserId));
      setFilteredUsers(prev => prev.filter(user => user.id !== selectedUserId));
      
      handleDeleteDialogClose();
    } catch (err) {
      setError('Erro ao excluir usuário');
      handleDeleteDialogClose();
    }
  };
  
  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          mb: 3, 
          gap: 2 
        }}>
          <Typography variant="h5" component="h1" fontWeight={600}>
            Usuários
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Buscar usuários..."
              size="small"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            
            {canCreateUsers && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate('/usuarios/novo')}
                sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
              >
                Novo Usuário
              </Button>
            )}
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Último Acesso</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Carregando usuários...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      Nenhum usuário encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getRoleById(user.role)?.name || user.role} 
                        color={
                          user.role === 'admin' ? 'primary' : 
                          user.role === 'supervisor' ? 'secondary' : 
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status ? 'Ativo' : 'Inativo'} 
                        color={user.status ? 'success' : 'error'}
                        size="small"
                        icon={user.status ? <CheckCircle /> : <Cancel />}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ações">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user.id)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Menu de ações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {canEditUsers && (
            <MenuItem onClick={() => {
              navigate(`/usuarios/editar/${selectedUserId}`);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
          )}
          
          {canEditUsers && (
            <MenuItem onClick={() => {
              navigate(`/usuarios/reset-senha/${selectedUserId}`);
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Lock fontSize="small" />
              </ListItemIcon>
              <ListItemText>Resetar Senha</ListItemText>
            </MenuItem>
          )}
          
          <MenuItem onClick={() => {
            navigate(`/usuarios/detalhes/${selectedUserId}`);
            handleMenuClose();
          }}>
            <ListItemIcon>
              <Info fontSize="small" />
            </ListItemIcon>
            <ListItemText>Detalhes</ListItemText>
          </MenuItem>
          
          {canDeleteUsers && (
            <MenuItem onClick={handleDeleteClick}>
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText sx={{ color: 'error.main' }}>Excluir</ListItemText>
            </MenuItem>
          )}
        </Menu>
        
        {/* Diálogo de confirmação de exclusão */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default UserList;