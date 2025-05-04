// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  FormControlLabel, 
  Checkbox, 
  InputAdornment, 
  IconButton, 
  Divider,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

// Styled components
const LoginContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  background: theme.palette.mode === 'dark' 
    ? theme.palette.background.default
    : theme.palette.background.default
}));

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4)
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '2.2rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1)
}));

const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2),
  fontWeight: 600,
  marginTop: theme.spacing(2),
  borderRadius: 8,
  textTransform: 'none'
}));

const DividerText = styled(Box)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  display: 'flex',
  alignItems: 'center',
  '&::before, &::after': {
    content: '""',
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.divider
  }
}));

const DividerContent = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem'
}));

const Footer = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: 'center',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary
}));

const TestCredentialsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.info.light, 0.1),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
}));

const Login = () => {
  const theme = useTheme();
  const { login, loading: isLoading, error, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [localError, setLocalError] = useState('');
  
  // Verificar se o usuário está autenticado e redirecionar para a página principal
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
    
    // Limpar mensagens de erro quando o usuário começa a digitar
    if (localError) setLocalError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, rememberMe } = formData;
    
    if (!email || !password) {
      setLocalError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      // Fazer login
      await login(email, password);
      
      // Se rememberMe estiver marcado, salvar isso no localStorage
      if (rememberMe) {
        localStorage.setItem('remember_user', email);
      } else {
        localStorage.removeItem('remember_user');
      }
    } catch (err) {
      setLocalError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };
  
  // Carregar email salvo no localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('remember_user');
    if (savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  // Função para preencher automaticamente as credenciais
  const preencherCredenciais = (tipo) => {
    switch (tipo) {
      case 'admin':
        setFormData({
          ...formData,
          email: 'admin@example.com',
          password: 'admin123'
        });
        break;
      case 'vendedor':
        setFormData({
          ...formData,
          email: 'vendedor@example.com',
          password: 'vendedor123'
        });
        break;
      case 'proprietario':
        setFormData({
          ...formData,
          email: 'proprietario@example.com',
          password: 'proprietario123'
        });
        break;
      default:
        break;
    }
  };
  
  // Mostrar erro combinado (do contexto ou local)
  const displayError = error || localError;
  
  return (
    <LoginContainer>
      <LoginForm elevation={3}>
        <LogoContainer>
          <Logo variant="h1">GestLotes</Logo>
          <Typography variant="subtitle1" color="textSecondary">
            Sistema de Gestão de Loteamentos
          </Typography>
        </LogoContainer>
        
        {displayError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {displayError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemplo@email.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
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
            sx={{ mb: 1 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Lembrar-me</Typography>}
            />
            
            <Link to="/esqueci-senha" style={{ textDecoration: 'none' }}>
              <MuiLink component="span" variant="body2" color="primary" underline="hover">
                Esqueceu a senha?
              </MuiLink>
            </Link>
          </Box>
          
          <LoginButton
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Entrar'}
          </LoginButton>
        </form>
        
        
        
        <DividerText>
          <DividerContent>ou</DividerContent>
        </DividerText>
        
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => navigate('/contato')}
          sx={{ 
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 500
          }}
        >
          Entre em contato para acesso
        </Button>
        
        <Footer>
          © {new Date().getFullYear()} GestLotes. Todos os direitos reservados.
        </Footer>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;