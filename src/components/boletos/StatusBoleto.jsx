import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  CheckCircle as PaidIcon,
  Cancel as CancelledIcon,
  Schedule as PendingIcon,
  Warning as OverdueIcon
} from '@mui/icons-material';

/**
 * Componente para exibir o status do boleto com estilo apropriado
 * @param {Object} props - Propriedades do componente
 * @param {string} props.status - Status do boleto ('gerado', 'pago', 'vencido', 'cancelado')
 * @param {Object} props.style - Estilos adicionais
 */
const StatusBoleto = ({ status, style = {}, ...props }) => {
  let color = 'default';
  let icon = null;
  let label = status;
  let tooltipText = '';

  switch (status?.toLowerCase()) {
    case 'pago':
      color = 'success';
      icon = <PaidIcon />;
      tooltipText = 'Pagamento confirmado';
      break;
    case 'cancelado':
      color = 'error';
      icon = <CancelledIcon />;
      tooltipText = 'Boleto cancelado';
      break;
    case 'vencido':
      color = 'warning';
      icon = <OverdueIcon />;
      tooltipText = 'Boleto vencido';
      break;
    case 'gerado':
    default:
      color = 'primary';
      icon = <PendingIcon />;
      label = 'Gerado';
      tooltipText = 'Boleto gerado, aguardando pagamento';
      break;
  }

  return (
    <Tooltip title={tooltipText}>
      <Chip
        label={label}
        color={color}
        icon={icon}
        size="small"
        variant="filled"
        style={{ textTransform: 'capitalize', ...style }}
        {...props}
      />
    </Tooltip>
  );
};

export default StatusBoleto;