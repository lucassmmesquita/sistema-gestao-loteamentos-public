import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Paper, Grid, Typography, Card, CardContent, Button, 
  IconButton, Tooltip, CircularProgress, Badge, useMediaQuery 
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { 
  ChevronLeft, ChevronRight, Refresh, CheckCircle, 
  WarningAmber, CalendarToday, Visibility 
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
        isSameMonth, isToday, isWeekend, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReajusteContext } from '../../contexts/ReajusteContext';
import DetalheReajuste from './DetalheReajuste';
import { fetchReajustesPrevistos } from '../../services/reajusteService';

// Estilos personalizados
const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const CalendarGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const CalendarDayHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const CalendarDayCell = styled(Box)(({ 
  theme, 
  isCurrentMonth, 
  isWeekend, 
  isToday,
  hasReajustes,
  hasReajustesPendentes 
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
  border: isToday 
    ? `1px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
  cursor: hasReajustes ? 'pointer' : 'default',
  ...(hasReajustesPendentes && {
    border: `1px solid ${theme.palette.warning.main}`,
  }),
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

const ReajusteIndicator = styled(Box)(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: status === 'pendente' 
    ? theme.palette.warning.main 
    : status === 'aplicado' 
      ? theme.palette.success.main 
      : theme.palette.grey[500],
  display: 'inline-block',
  marginRight: 4,
}));

const ReajusteItem = styled(Box)(({ theme, status }) => ({
  padding: theme.spacing(0.5, 1),
  marginBottom: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  fontWeight: 500,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  backgroundColor: status === 'pendente' 
    ? alpha(theme.palette.warning.main, 0.1) 
    : status === 'aplicado' 
      ? alpha(theme.palette.success.main, 0.1) 
      : alpha(theme.palette.grey[500], 0.1),
  border: `1px solid ${
    status === 'pendente' 
      ? alpha(theme.palette.warning.main, 0.2) 
      : status === 'aplicado' 
        ? alpha(theme.palette.success.main, 0.2) 
        : alpha(theme.palette.grey[500], 0.2)
  }`,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const MonthTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '1.25rem',
  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

const CalendarLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.background.paper, 0.5) 
    : alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${theme.palette.divider}`,
}));

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
}));

// Componente principal
const CalendarioReajustes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Context
  const { 
    reajustes, 
    carregarReajustes, 
    executarReajuste, 
    loading 
  } = useReajusteContext();
  
  // Estados locais
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diasCalendario, setDiasCalendario] = useState([]);
  const [reajustesPrevistos, setReajustesPrevistos] = useState([]);
  const [reajusteSelecionado, setReajusteSelecionado] = useState(null);
  const [carregandoPrevistos, setCarregandoPrevistos] = useState(false);
  const [modalDetalheOpen, setModalDetalheOpen] = useState(false);
  
  // Funções auxiliares
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  // Navegar para mês anterior
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  // Navegar para próximo mês
  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  // Navegar para mês atual
  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };
  
  // Abrir detalhe do reajuste
  const handleOpenDetalhe = (reajuste) => {
    setReajusteSelecionado(reajuste);
    setModalDetalheOpen(true);
  };
  
  // Fechar detalhe do reajuste
  const handleCloseDetalhe = () => {
    setModalDetalheOpen(false);
    setReajusteSelecionado(null);
  };
  
  // Aplicar reajuste
  const handleAplicarReajuste = async (contratoId) => {
    await executarReajuste(contratoId);
    handleCloseDetalhe();
    carregarReajustesMes();
  };
  
  // Carregar reajustes do mês atual
  const carregarReajustesMes = useCallback(async () => {
    setCarregandoPrevistos(true);
    try {
      // Define o intervalo do mês atual
      const inicioMes = startOfMonth(currentDate);
      const fimMes = endOfMonth(currentDate);
      
      // Busca reajustes previstos para o mês
      const previstos = await fetchReajustesPrevistos(inicioMes, fimMes);
      setReajustesPrevistos(previstos);
    } catch (error) {
      console.error('Erro ao carregar reajustes previstos:', error);
    } finally {
      setCarregandoPrevistos(false);
    }
  }, [currentDate]);
  
  // Atualizar dias do calendário
  const atualizarDiasCalendario = useCallback(() => {
    // Obtém o primeiro e último dia do mês atual
    const inicioMes = startOfMonth(currentDate);
    const fimMes = endOfMonth(currentDate);
    
    // Cria array com todos os dias do mês
    const dias = eachDayOfInterval({ start: inicioMes, end: fimMes });
    
    // Determina em qual dia da semana (0-6) começa o mês
    const diaSemanaInicio = inicioMes.getDay();
    
    // Adiciona dias do mês anterior para preencher o início do calendário
    const diasAnteriores = [];
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      diasAnteriores.push(subMonths(inicioMes, 1));
    }
    
    // Determina quantos dias faltam para completar a última semana
    const diaSemanaFim = fimMes.getDay();
    const diasRestantes = 6 - diaSemanaFim;
    
    // Adiciona dias do próximo mês para completar o calendário
    const diasPosteriores = [];
    for (let i = 1; i <= diasRestantes; i++) {
      diasPosteriores.push(addMonths(inicioMes, 1));
    }
    
    // Combina os dias para formar o calendário completo
    setDiasCalendario([...diasAnteriores.reverse(), ...dias, ...diasPosteriores]);
  }, [currentDate]);
  
  // Verificar reajustes para um dia específico
  const getReajustesForDay = useCallback((day) => {
    const reajustesDoDia = [
      ...reajustes.filter(reajuste => 
        isSameDay(parseISO(reajuste.dataReferencia), day)
      ),
      ...reajustesPrevistos.filter(reajuste => 
        isSameDay(parseISO(reajuste.dataReferencia), day)
      )
    ];
    
    return reajustesDoDia;
  }, [reajustes, reajustesPrevistos]);
  
  // Efeitos
  useEffect(() => {
    atualizarDiasCalendario();
  }, [atualizarDiasCalendario]);
  
  useEffect(() => {
    carregarReajustesMes();
  }, [carregarReajustesMes, currentDate]);
  
  // Renderizar célula do calendário
  const renderDayCell = (day) => {
    const dayReajustes = getReajustesForDay(day);
    const isCurrentMonthDay = isSameMonth(day, currentDate);
    const isDayToday = isToday(day);
    const isDayWeekend = isWeekend(day);
    const hasPendingReajustes = dayReajustes.some(r => r.status === 'pendente');
    
    return (
      <Grid item xs={12 / 7} key={day.toString()}>
        <CalendarDayCell
          isCurrentMonth={isCurrentMonthDay}
          isWeekend={isDayWeekend}
          isToday={isDayToday}
          hasReajustes={dayReajustes.length > 0}
          hasReajustesPendentes={hasPendingReajustes}
          onClick={() => dayReajustes.length > 0 && handleOpenDetalhe(dayReajustes[0])}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <DayNumber variant="body2" isToday={isDayToday}>
              {day.getDate()}
            </DayNumber>
            
            {dayReajustes.length > 1 && (
              <Badge badgeContent={dayReajustes.length} color="primary" size="small" />
            )}
          </Box>
          
          <Box sx={{ overflow: 'auto', maxHeight: 'calc(100% - 28px)' }}>
          {dayReajustes.slice(0, 3).map((reajuste, index) => (
            <ReajusteItem key={index} status={reajuste.status || 'pendente'}>
                <ReajusteIndicator status={reajuste.status || 'pendente'} />
                <Typography variant="caption" noWrap>
                {reajuste.contrato?.numero || 
                (reajuste.contratoId ? `Contrato #${reajuste.contratoId}` : 'Contrato não identificado')}
                </Typography>
            </ReajusteItem>
            ))}
            
            {dayReajustes.length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
                +{dayReajustes.length - 3} mais
              </Typography>
            )}
          </Box>
        </CalendarDayCell>
      </Grid>
    );
  };
  
  return (
    <Box>
      {/* Cabeçalho do calendário */}
      <CalendarHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MonthTitle>
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </MonthTitle>
          
          {!isMobile && (
            <Tooltip title="Mês atual">
              <IconButton 
                size="small" 
                onClick={handleCurrentMonth}
                sx={{ ml: 1 }}
              >
                <CalendarToday fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Atualizar">
            <IconButton 
              onClick={carregarReajustesMes} 
              disabled={loading || carregandoPrevistos}
            >
              {(loading || carregandoPrevistos) ? (
                <CircularProgress size={24} />
              ) : (
                <Refresh />
              )}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Mês anterior">
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>
          
          {isMobile && (
            <Tooltip title="Mês atual">
              <IconButton onClick={handleCurrentMonth}>
                <CalendarToday />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Próximo mês">
            <IconButton onClick={handleNextMonth}>
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>
      </CalendarHeader>
      
      {/* Dias da semana */}
      <CalendarGrid container>
        {daysOfWeek.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <CalendarDayHeader>
              {day}
            </CalendarDayHeader>
          </Grid>
        ))}
      </CalendarGrid>
      
      {/* Dias do mês */}
      <CalendarGrid container>
        {diasCalendario.map(day => renderDayCell(day))}
      </CalendarGrid>
      
      {/* Legenda */}
      <CalendarLegend>
        <LegendItem>
          <ReajusteIndicator status="pendente" />
          Reajuste Pendente
        </LegendItem>
        <LegendItem>
          <ReajusteIndicator status="aplicado" />
          Reajuste Aplicado
        </LegendItem>
        <LegendItem>
          <Box 
            component="span" 
            sx={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              backgroundColor: theme.palette.primary.main,
              marginRight: 0.5
            }} 
          />
          Hoje
        </LegendItem>
      </CalendarLegend>
      
      {/* Modal de detalhes */}
      {reajusteSelecionado && (
        <DetalheReajuste 
          open={modalDetalheOpen}
          onClose={handleCloseDetalhe}
          reajuste={reajusteSelecionado}
          onAplicar={handleAplicarReajuste}
        />
      )}
    </Box>
  );
};

export default CalendarioReajustes;