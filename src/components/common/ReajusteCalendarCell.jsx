import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { isToday, isWeekend, isSameMonth } from 'date-fns';

// Estilos personalizados
const CellContainer = styled(Box)(({ 
  theme, 
  isCurrentMonth, 
  isWeekend, 
  isToday, 
  hasReajustes, 
  hasReajustesPendentes,
  isAtrasado,
  isIminente
}) => ({
  height: '100%',
  minHeight: 100,
  padding: theme.spacing(1),
  backgroundColor: isToday 
    ? alpha(theme.palette.primary.main, 0.1)
    : isWeekend 
      ? theme.palette.mode === 'dark' 
        ? alpha(theme.palette.background.paper, 0.3) 
        : alpha(theme.palette.background.paper, 0.5)
      : 'transparent',
  color: !isCurrentMonth 
    ? theme.palette.text.disabled 
    : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${
    isToday 
      ? theme.palette.primary.main 
      : isAtrasado
        ? theme.palette.error.main
        : isIminente
          ? theme.palette.info.main
          : hasReajustesPendentes
            ? theme.palette.warning.main
            : theme.palette.divider
  }`,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
  cursor: hasReajustes ? 'pointer' : 'default',
}));

const DayNumber = styled(Typography)(({ theme, isToday }) => ({
  fontWeight: isToday ? 600 : 400,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: isToday ? 28 : 'auto',
  height: isToday ? 28 : 'auto',
  borderRadius: isToday ? '50%' : 0,
  backgroundColor: isToday ? theme.palette.primary.main : 'transparent',
  color: isToday ? theme.palette.primary.contrastText : 'inherit',
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const ReajusteIndicator = styled(Box)(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'aplicado':
        return theme.palette.success.main;
      case 'pendente':
        return theme.palette.warning.main;
      case 'atrasado':
        return theme.palette.error.main;
      case 'iminente':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: getStatusColor(),
    display: 'inline-block',
    marginRight: 4,
  };
});

const ReajusteItem = styled(Box)(({ theme, status }) => {
  const getStatusColors = () => {
    switch (status) {
      case 'aplicado':
        return {
          bg: alpha(theme.palette.success.main, 0.1),
          border: alpha(theme.palette.success.main, 0.2)
        };
      case 'pendente':
        return {
          bg: alpha(theme.palette.warning.main, 0.1),
          border: alpha(theme.palette.warning.main, 0.2)
        };
      case 'atrasado':
        return {
          bg: alpha(theme.palette.error.main, 0.1),
          border: alpha(theme.palette.error.main, 0.2)
        };
      case 'iminente':
        return {
          bg: alpha(theme.palette.info.main, 0.1),
          border: alpha(theme.palette.info.main, 0.2)
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          border: alpha(theme.palette.grey[500], 0.2)
        };
    }
  };
  
  const { bg, border } = getStatusColors();
  
  return {
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
    fontWeight: 500,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: bg,
    border: `1px solid ${border}`,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
  };
});

// Componente principal
const ReajusteCalendarCell = ({ 
  day, 
  currentMonth, 
  reajustes = [], 
  onClick 
}) => {
  const theme = useTheme();
  
  // Verificações de data
  const isDayToday = isToday(day);
  const isDayWeekend = isWeekend(day);
  const isCurrentMonthDay = isSameMonth(day, currentMonth);
  
  // Verificações de reajustes
  const hasReajustesPendentes = reajustes.some(r => r.status === 'pendente' || r.status === 'iminente');
  const hasReajustesAtrasados = reajustes.some(r => r.status === 'atrasado');
  const hasReajustesIminentes = reajustes.some(r => r.status === 'iminente');
  
  return (
    <CellContainer
      isCurrentMonth={isCurrentMonthDay}
      isWeekend={isDayWeekend}
      isToday={isDayToday}
      hasReajustes={reajustes.length > 0}
      hasReajustesPendentes={hasReajustesPendentes}
      isAtrasado={hasReajustesAtrasados}
      isIminente={hasReajustesIminentes}
      onClick={() => reajustes.length > 0 && onClick && onClick(reajustes)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <DayNumber variant="body2" isToday={isDayToday}>
          {day.getDate()}
        </DayNumber>
        
        {reajustes.length > 1 && (
          <Badge badgeContent={reajustes.length} color="primary" size="small" />
        )}
      </Box>
      
      <Box sx={{ overflow: 'auto', maxHeight: 'calc(100% - 28px)' }}>
        {reajustes.slice(0, 3).map((reajuste, index) => (
          <ReajusteItem key={index} status={reajuste.status || 'pendente'}>
            <ReajusteIndicator status={reajuste.status || 'pendente'} />
            <Typography variant="caption" noWrap>
              {reajuste.contrato?.numero || `Contrato #${reajuste.contratoId}`}
            </Typography>
          </ReajusteItem>
        ))}
        
        {reajustes.length > 3 && (
          <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
            +{reajustes.length - 3} mais
          </Typography>
        )}
      </Box>
    </CellContainer>
  );
};

export default ReajusteCalendarCell;