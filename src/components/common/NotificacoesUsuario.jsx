// src/components/common/NotificacoesUsuario.jsx

import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificacoesUsuario = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [novasNotificacoes, setNovasNotificacoes] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Carregar notificações do usuário
  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await api.get('/notificacoes');
        setNotificacoes(response.data);
        setNovasNotificacoes(response.data.filter(n => !n.lida).length);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
      }
    };

    fetchNotificacoes();
    
    // Em um sistema real, você poderia implementar polling ou WebSockets
    const interval = setInterval(fetchNotificacoes, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarcarComoLida = async (id) => {
    try {
      await api.patch(`/notificacoes/${id}/marcar-lida`);
      
      // Atualizar estado local
      setNotificacoes(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, lida: true } : notif
        )
      );
      
      setNovasNotificacoes(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      await api.patch('/notificacoes/marcar-todas-lidas');
      
      // Atualizar estado local
      setNotificacoes(prev =>
        prev.map(notif => ({ ...notif, lida: true }))
      );
      
      setNovasNotificacoes(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  };

  const getTipoNotificacao = (tipo) => {
    switch (tipo) {
      case 'aditivo_pendente':
        return 'Aditivo Pendente';
      case 'contrato_aprovado':
        return 'Contrato Aprovado';
      case 'contrato_pendente':
        return 'Contrato Pendente';
      default:
        return tipo;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        aria-label="exibir notificações"
        aria-controls="notificacoes-menu"
        aria-haspopup="true"
        color="inherit"
      >
        <Badge badgeContent={novasNotificacoes} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        id="notificacoes-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 350,
            maxHeight: 400,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notificações</Typography>
          {novasNotificacoes > 0 && (
            <Button
              size="small"
              onClick={handleMarcarTodasComoLidas}
            >
              Marcar todas como lidas
            </Button>
          )}
        </Box>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto', maxHeight: 300, py: 1 }}>
          {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
              <MenuItem
                key={notificacao.id}
                onClick={() => handleMarcarComoLida(notificacao.id)}
                sx={{
                  display: 'block',
                  py: 1,
                  px: 2,
                  backgroundColor: notificacao.lida ? 'inherit' : 'rgba(0,0,0,0.04)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: notificacao.lida ? 'normal' : 'bold' }}>
                    {notificacao.titulo}
                  </Typography>
                  <Chip
                    label={getTipoNotificacao(notificacao.tipo)}
                    size="small"
                    color={
                      notificacao.tipo.includes('pendente') ? 'warning' : 'success'
                    }
                    sx={{ ml: 1 }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {notificacao.mensagem}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatDistanceToNow(new Date(notificacao.dataCriacao), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </Typography>
                  
                  {notificacao.lida ? (
                    <CheckIcon fontSize="small" color="success" />
                  ) : (
                    <Button
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarcarComoLida(notificacao.id);
                      }}
                    >
                      Marcar como lida
                    </Button>
                  )}
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Não há notificações
              </Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificacoesUsuario;