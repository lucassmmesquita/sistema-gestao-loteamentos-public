import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Container,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';

// AppleSection component - A container for content sections with Apple-style
export const AppleSection = styled(Box)(({ theme, dark, gradient, center }) => ({
  padding: theme.spacing(6, 0),
  backgroundColor: dark 
    ? theme.palette.mode === 'dark' 
      ? '#000' 
      : '#1d1d1f' 
    : theme.palette.mode === 'dark' 
      ? '#1d1d1f' 
      : '#f5f5f7',
  color: dark 
    ? '#f5f5f7' 
    : theme.palette.text.primary,
  backgroundImage: gradient 
    ? `linear-gradient(180deg, ${theme.palette.mode === 'dark' 
        ? 'rgba(45, 45, 47, 0.8) 0%, rgba(29, 29, 31, 1) 100%' 
        : 'rgba(255, 255, 255, 0.8) 0%, rgba(245, 245, 247, 1) 100%'})`
    : 'none',
  textAlign: center ? 'center' : 'left',
  position: 'relative',
  overflow: 'hidden',
}));

// AppleSectionContent - Container for the content inside an AppleSection
export const AppleSectionContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

// AppleTitle - For main section titles with Apple's typography
export const AppleTitle = styled(Typography)(({ theme, dark }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  letterSpacing: '-0.025em',
  color: dark ? '#f5f5f7' : theme.palette.text.primary,
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
}));

// AppleSubtitle - For secondary titles with Apple's typography
export const AppleSubtitle = styled(Typography)(({ theme, dark }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  letterSpacing: '-0.025em',
  color: dark ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
  [theme.breakpoints.down('md')]: {
    fontSize: '1.25rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.125rem',
  },
}));

// AppleText - For body text with Apple's typography
export const AppleText = styled(Typography)(({ theme, dark }) => ({
  fontSize: '1rem',
  lineHeight: 1.5,
  color: dark ? 'rgba(255,255,255,0.8)' : theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica Neue", sans-serif',
}));

// AppleCard - Card component with Apple design style
export const AppleCard = styled(Card)(({ theme, elevated }) => ({
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2f' : '#ffffff',
  boxShadow: elevated 
    ? '0 8px 24px rgba(0, 0, 0, 0.12)' 
    : '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
  },
}));

// AppleCardContent - Content container for AppleCard
export const AppleCardContent = styled(CardContent)(({ theme, noPadding }) => ({
  padding: noPadding ? 0 : theme.spacing(3),
}));

// AppleCardActions - Action buttons container for AppleCard
export const AppleCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  justifyContent: 'flex-end',
}));

// AppleCardMedia - Media component for AppleCard
export const AppleCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 0,
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

// AppleButton - Button with Apple design style
export const AppleButton = styled(Button)(({ theme, variant, color }) => ({
  borderRadius: 8,
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  boxShadow: 'none',
  fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica Neue", sans-serif',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
  },
}));

// ApplePaper - Paper component with Apple design style
export const ApplePaper = styled(Paper)(({ theme, noPadding }) => ({
  borderRadius: 12,
  padding: noPadding ? 0 : theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2f' : '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

// AppleDivider - Divider with Apple design style
export const AppleDivider = styled(Divider)(({ theme, light }) => ({
  margin: theme.spacing(3, 0),
  backgroundColor: light 
    ? theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)' 
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.08)',
}));

// AppleList - List component with Apple design style
export const AppleList = styled(List)(({ theme }) => ({
  padding: theme.spacing(0),
}));

// AppleListItem - ListItem with Apple design style
export const AppleListItem = styled(ListItem)(({ theme, clickable }) => ({
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'}`,
  transition: clickable ? 'all 0.3s ease' : 'none',
  borderRadius: clickable ? 8 : 0,
  '&:hover': clickable ? {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(0, 0, 0, 0.02)',
    transform: 'translateX(4px)',
  } : {},
  '&:last-child': {
    borderBottom: 'none',
  },
}));

// AppleListItemText - ListItemText with Apple typography
export const AppleListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  '& .MuiListItemText-secondary': {
    fontSize: '0.85rem',
  },
}));

// Apple Dashboard Card component
export const AppleDashboardCard = ({ title, value, icon, trend, colorClass }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <AppleCard elevated>
      <AppleCardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          justifyContent: 'space-between' 
        }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              fontSize: isMobile ? '1.75rem' : '2.5rem',
              letterSpacing: '-0.025em',
              mb: 1
            }}>
              {value}
            </Typography>
            {trend && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: trend.startsWith('+') 
                    ? theme.palette.success.main 
                    : theme.palette.error.main,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500
                }}
              >
                {trend}
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  component="span" 
                  sx={{ ml: 0.5 }}
                >
                  vs último mês
                </Typography>
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette[colorClass || 'primary'].main, 0.15)
              : alpha(theme.palette[colorClass || 'primary'].main, 0.1)
          }}>
            {icon}
          </Box>
        </Box>
      </AppleCardContent>
    </AppleCard>
  );
};

// Apple Feature Link - For featured item links
export const AppleFeatureLink = ({ title, subtitle, icon, onClick }) => {
  const theme = useTheme();
  
  return (
    <Box 
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.02)',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)',
          transform: 'translateY(-2px)',
        }
      }}
    >
      <Box 
        sx={{ 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '10px',
          backgroundColor: theme.palette.primary.main,
          color: '#fff'
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      </Box>
      <IconButton size="small">
        <ArrowForward fontSize="small" />
      </IconButton>
    </Box>
  );
};

// Export a basic component that combines multiple Apple components
export const AppleContentSection = ({ title, subtitle, children, dark, center, maxWidth = 'lg' }) => {
  return (
    <AppleSection dark={dark} center={center}>
      <AppleSectionContent maxWidth={maxWidth}>
        {title && <AppleTitle dark={dark} align={center ? 'center' : 'left'}>{title}</AppleTitle>}
        {subtitle && <AppleSubtitle dark={dark} align={center ? 'center' : 'left'}>{subtitle}</AppleSubtitle>}
        {children}
      </AppleSectionContent>
    </AppleSection>
  );
};

export default {
  AppleSection,
  AppleSectionContent,
  AppleTitle,
  AppleSubtitle,
  AppleText,
  AppleCard,
  AppleCardContent,
  AppleCardActions,
  AppleCardMedia,
  AppleButton,
  ApplePaper,
  AppleDivider,
  AppleList,
  AppleListItem,
  AppleListItemText,
  AppleDashboardCard,
  AppleFeatureLink,
  AppleContentSection
};