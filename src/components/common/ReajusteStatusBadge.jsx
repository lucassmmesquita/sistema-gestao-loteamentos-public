import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { 
  CheckCircle, Warning, Error, Schedule, CalendarMonth
} from '@mui/icons-material';

// Estilos personalizados
const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'aplicado':
        return {
          bg: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          border: alpha(theme.palette.success.main, 0.2)
        };
      case 'pendente':
        return {
          bg: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
          border: alpha(theme.palette.warning.main, 0.2)
        };
      case 'atrasado':
        return {
          bg: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          border: alpha(theme.palette.error.main, 0.2)
        };
      case 'iminente':
        return {
          bg: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark,
          border: alpha(theme.palette.info.main, 0.2)
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[700],
          border: alpha(theme.palette.grey[500], 0.2)
        };
    }
  };
  
  const { bg, color, border } = getStatusColors();
  
  return {
    borderRadius: 16,
    fontWeight: 500,
    fontSize: '0.75rem',
    backgroundColor: bg,
    color: color,
    border: `1px solid ${border}`,
    '& .MuiChip-icon': {
      color: 'inherit',
    },
  };
});

// Componente principal
const ReajusteStatusBadge = ({ status, tooltipText, size = 'small', ...props }) => {
  // Definir ícone com base no status
  const getStatusIcon = () => {
    switch (status) {
      case 'aplicado':
        return <CheckCircle fontSize="small" />;
      case 'pendente':
        return <CalendarMonth fontSize="small" />;
      case 'atrasado':
        return <Error fontSize="small" />;
      case 'iminente':
        return <Schedule fontSize="small" />;
      default:
        return <Warning fontSize="small" />;
    }
  };
  
  // Definir label com base no status
  const getStatusLabel = () => {
    switch (status) {
      case 'aplicado':
        return 'Aplicado';
      case 'pendente':
        return 'Pendente';
      case 'atrasado':
        return 'Atrasado';
      case 'iminente':
        return 'Iminente';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  return (
    <Tooltip title={tooltipText || ''} arrow>
      <StatusChip
        label={getStatusLabel()}
        icon={getStatusIcon()}
        status={status}
        size={size}
        {...props}
      />
    </Tooltip>
  );
};

export default ReajusteStatusBadge;