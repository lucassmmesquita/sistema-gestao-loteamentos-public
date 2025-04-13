import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Phone,
  Email,
  WhatsApp,
  Person,
  Comment,
  Visibility,
  AttachFile,
  HistoryEdu,
  Done,
  ErrorOutline,
  AccessTime
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Componente para exibir o histórico de interações ou comunicações com o cliente
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.interacoes - Lista de interações ou comunicações
 * @param {boolean} props.loading - Estado de carregamento
 * @param {string} props.tipo - Tipo de histórico: "interacao" ou "comunicacao"
 * @returns {JSX.Element} - Componente renderizado
 */
const HistoricoInteracoes = ({ interacoes = [], loading = false, tipo = "interacao" }) => {
  const theme = useTheme();

  // Função para obter ícone baseado no tipo de interação/comunicação
  const obterIcone = (tipoItem) => {
    switch (tipoItem) {
      case 'telefone':
        return <Phone />;
      case 'email':
        return <Email />;
      case 'whatsapp':
        return <WhatsApp />;
      case 'presencial':
        return <Person />;
      case 'sms':
        return <Comment />;
      default:
        return <HistoryEdu />;
    }
  };
  
  // Função para obter cor baseada no tipo de interação/comunicação
  const obterCorAvatar = (tipoItem) => {
    switch (tipoItem) {
      case 'telefone':
        return theme.palette.info.main;
      case 'email':
        return theme.palette.primary.main;
      case 'whatsapp':
        return theme.palette.success.main;
      case 'presencial':
        return theme.palette.secondary.main;
      case 'sms':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  // Função para obter o status da comunicação
  const obterChipStatus = (status) => {
    switch (status) {
      case 'enviado':
        return (
          <Chip 
            icon={<Done fontSize="small" />} 
            label="Enviado" 
            size="small" 
            color="success" 
          />
        );
      case 'pendente':
        return (
          <Chip 
            icon={<AccessTime fontSize="small" />} 
            label="Pendente" 
            size="small" 
            color="warning" 
          />
        );
      case 'falha':
        return (
          <Chip 
            icon={<ErrorOutline fontSize="small" />} 
            label="Falha" 
            size="small" 
            color="error" 
          />
        );
      default:
        return null;
    }
  };
  
  // Renderizar mensagem quando não há dados
  if (!loading && (!interacoes || interacoes.length === 0)) {
    return (
      <Alert severity="info">
        {tipo === "interacao" 
          ? "Nenhuma interação registrada com este cliente." 
          : "Nenhuma comunicação enviada para este cliente."
        }
      </Alert>
    );
  }
  
  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {interacoes.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: obterCorAvatar(item.tipo) }}>
                    {obterIcone(item.tipo)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="subtitle1" component="span">
                        {tipo === "interacao" 
                          ? `Contato via ${item.tipo === 'telefone' ? 'Telefone' : 
                              item.tipo === 'email' ? 'E-mail' : 
                              item.tipo === 'whatsapp' ? 'WhatsApp' : 
                              item.tipo === 'presencial' ? 'Presencial' : 
                              item.tipo === 'sms' ? 'SMS' : 
                              item.tipo}`
                          : `Cobrança via ${item.tipo === 'email' ? 'E-mail' : 
                              item.tipo === 'whatsapp' ? 'WhatsApp' : 
                              item.tipo === 'sms' ? 'SMS' : 
                              item.tipo}`
                        }
                      </Typography>
                      
                      {/* Chip para parcela, se disponível */}
                      {item.parcela && (
                        <Chip 
                          label={`Parcela ${item.parcela.numero}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                      
                      {/* Status para comunicações */}
                      {tipo === "comunicacao" && item.status && obterChipStatus(item.status)}
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item.observacao || item.mensagem}
                      </Typography>
                      <Typography 
                        component="span" 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {' • '}
                        {formatDistanceToNow(new Date(item.data), { 
                          addSuffix: true,
                          locale: ptBR
                        })}
                        
                        {/* Usuário que registrou, se disponível */}
                        {item.usuario && (
                          <>
                            {' • '}
                            Por: {item.usuario}
                          </>
                        )}
                      </Typography>
                    </React.Fragment>
                  }
                />
                
                {/* Ações secundárias */}
                <ListItemSecondaryAction>
                  {tipo === "comunicacao" && item.anexos && item.anexos.length > 0 && (
                    <Tooltip title="Ver anexos">
                      <IconButton edge="end" aria-label="anexos" size="small">
                        <AttachFile />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Tooltip title="Ver detalhes">
                    <IconButton edge="end" aria-label="detalhes" size="small" sx={{ ml: 1 }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              {index < interacoes.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HistoricoInteracoes;