// src/pages/users/UserForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Save, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAllRoles } from '../../utils/roles';

// Componente de formulário de usuário
const UserForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { checkPermission } = useAuth();
  const isEditing = !!userId;
  
  // Estado para dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: true,
    phone: '',
    notes: ''
  });
  
  // Estados para gerenciar o formulário
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Lista de perfis disponíveis
  const roles = getAllRoles();
  
  // Verifica permissões
  const canEditUsers = checkPermission('users:edit');
  const canCreateUsers = checkPermission('users:create');
  
  // Carrega dados do usuário caso seja edição
  useEffect(() => {
    const fetchUser = async () => {
      if (isEditing) {
        setLoading(true);
        try {
          // Aqui seria feita uma requisição para o backend
          // Usando dados mock para demonstração
          setTimeout(() => {
            setFormData({
              id: userId,
              name: 'Nome do Usuário',
              email: 'usuario@exemplo.com',
              password: '',
              confirmPassword: '',
              role: 'operator',
              status: true,
              phone: '(11) 98765-4321',
              notes: 'Notas sobre o usuário'
            });
            setLoading(false);
          }, 1000);
        } catch (err) {
          setError('Erro ao carregar dados do usuário');
          setLoading(false);
        }
      }
    };
    
    fetchUser();
  }, [userId, isEditing]);
  
  // Handler para alteração nos campos
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? checked : value
    }));
    
    // Limpa erro de validação ao modificar campo
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validação do formulário
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!isEditing) {
      if (!formData.password) {
        errors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }
    
    if (!formData.role) {
      errors.role = 'Perfil é obrigatório';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handler para salvar
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica permissões
    if ((isEditing && !canEditUsers) || (!isEditing && !canCreateUsers)) {
      setError('Você não tem permissão para esta ação');
      return;
    }
    
    // Valida o formulário
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Aqui seria feita requisição para o backend
      // Simulando operação com setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (err) {
      setError(`Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handler para voltar
  const handleBack = () => {
    navigate('/usuarios');
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mr: 2, borderRadius: 2 }}
          >
            Voltar
          </Button>
          
          <Typography variant="h5" component="h1" fontWeight={600}>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Usuário {isEditing ? 'atualizado' : 'criado'} com sucesso!
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!validationErrors.email}
                helperText={validationErrors.email}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Senha"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password || (isEditing ? 'Deixe em branco para manter a senha atual' : '')}
                required={!isEditing}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirmar senha"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!validationErrors.confirmPassword}
                helperText={validationErrors.confirmPassword}
                required={!isEditing}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!validationErrors.role} required>
                <InputLabel id="role-label">Perfil</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Perfil"
                  disabled={loading}
                >
                  {roles.map(role => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.role && (
                  <FormHelperText>{validationErrors.role}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Usuário ativo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ borderRadius: 2 }}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UserForm;