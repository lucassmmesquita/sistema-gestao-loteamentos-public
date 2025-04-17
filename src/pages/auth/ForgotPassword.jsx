// src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Link as MuiLink,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Email, ArrowBack } from '@mui/icons-material';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  background: theme.palette.background.default
}));

const ResetForm = styled(Paper)(({ theme }) => ({
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

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.2),
  fontWeight: 600,
  marginTop: theme.spacing(2),
  borderRadius: 8,
  textTransform: 'none'
}));

const Footer = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: 'center',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Por favor, informe seu email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simula envio de email de recuperação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      setError('Não foi possível enviar o email de recuperação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container>
      <ResetForm elevation={3}>
        <LogoContainer>
          <Logo variant="h1">GestLotes</Logo>
          <Typography variant="subtitle1" color="textSecondary">
            Recuperação de Senha
          </Typography>
        </LogoContainer>
        
        {success ? (
          <>
            <Alert 
              severity="success" 
              sx={{ mb: 3 }}
            >
              Email de recuperação enviado com sucesso! Por favor, verifique sua caixa de entrada.
            </Alert>
            
            <Typography variant="body2" paragraph>
              Enviamos instruções para recuperar sua senha para o email {email}.
              Se não receber o email em alguns minutos, verifique sua pasta de spam.
            </Typography>
            
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              startIcon={<ArrowBack />}
              sx={{ 
                mt: 2,
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Voltar para o login
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography variant="body2" paragraph>
              Informe seu email de cadastro para receber instruções de recuperação de senha.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enviar Instruções'}
            </SubmitButton>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <MuiLink component="span" underline="hover">
                  Voltar para o login
                </MuiLink>
              </Link>
            </Box>
          </form>
        )}
        
        <Footer>
          © {new Date().getFullYear()} GestLotes. Todos os direitos reservados.
        </Footer>
      </ResetForm>
    </Container>
  );
};

export default ForgotPassword;