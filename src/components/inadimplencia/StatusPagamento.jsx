import React from 'react';
import { Chip, useTheme } from '@mui/material';
import {
  CheckCircle,
  WarningAmber,
  Error,
  HourglassEmpty
} from '@mui/icons-material';

/**
 * Componente para exibir o status de pagamento com estilo visual consistente
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status de pagamento (em_aberto, parcial, pago, atrasado)
 * @param {string} props.size - Tamanho do chip (small, medium)
 * @param {boolean} props.variant - Variante do chip (filled, outlined)
 * @returns {JSX.Element} - Componente renderizado
 */
const StatusPagamento = ({ status, size = 'small', variant = 'filled' }) => {
  const theme = useTheme();
  
  // Define a configuração visual baseada no status
  const configPorStatus = {
    em_aberto: {
      label: 'Em Aberto',
      color: 'warning',
      icon: <HourglassEmpty fontSize="small" />,
      tooltip: 'Pagamento pendente'
    },
    parcial: {
      label: 'Parcial',
      color: 'info',
      icon: <WarningAmber fontSize="small" />,
      tooltip: 'Pagamento parcial realizado'
    },
    pago: {
      label: 'Pago',
      color: 'success',
      icon: <CheckCircle fontSize="small" />,
      tooltip: 'Pagamento completo'
    },
    atrasado: {
      label: 'Atrasado',
      color: 'error',
      icon: <Error fontSize="small" />,
      tooltip: 'Pagamento atrasado'
    },
    // Caso padrão se o status não corresponder a nenhum dos acima
    default: {
      label: 'Desconhecido',
      color: 'default',
      icon: null,
      tooltip: 'Status desconhecido'
    }
  };
  
  // Obtém a configuração para o status atual ou usa o padrão se não encontrado
  const config = configPorStatus[status] || configPorStatus.default;
  
  return (
    <Chip
      label={config.label}
      color={config.color}
      icon={config.icon}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 500,
        borderRadius: 4,
        '& .MuiChip-icon': {
          marginLeft: '4px'
        },
        boxShadow: 'none',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
      }}
    />
  );
};

export default StatusPagamento;