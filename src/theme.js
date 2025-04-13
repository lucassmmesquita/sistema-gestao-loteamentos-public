import { createTheme } from '@mui/material/styles';

// Tema personalizado para Material UI que incorpora o estilo visual da Apple
const theme = createTheme({
  palette: {
    primary: {
      main: '#0071e3', // --primary
      dark: '#0051a8', // --primary-dark
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6e6e73', // --secondary
      dark: '#4d4d53', // --secondary-dark
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff3b30', // --danger
    },
    warning: {
      main: '#ff9500', // --warning
    },
    info: {
      main: '#5ac8fa', // --info
    },
    success: {
      main: '#34c759', // --success
    },
    text: {
      primary: '#1d1d1f', // --text-primary
      secondary: '#6e6e73', // --text-secondary
      disabled: '#a1a1a6', // --text-disabled
    },
    background: {
      default: '#f5f5f7', // --background
      paper: '#ffffff', // --card-background
    },
    divider: '#e5e5ea', // --divider-color
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // Apple não usa botões com todas as letras maiúsculas
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // --border-radius
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 2px 4px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 4px 12px rgba(0, 0, 0, 0.08)', // --box-shadow
    '0 6px 12px rgba(0, 0, 0, 0.1)',
    '0 6px 16px rgba(0, 0, 0, 0.12)',
    '0 8px 18px rgba(0, 0, 0, 0.14)',
    '0 8px 20px rgba(0, 0, 0, 0.12)', // --box-shadow-hover
    '0 10px 22px rgba(0, 0, 0, 0.14)',
    '0 10px 25px rgba(0, 0, 0, 0.16)',
    '0 12px 28px rgba(0, 0, 0, 0.18)',
    '0 12px 30px rgba(0, 0, 0, 0.2)',
    '0 14px 32px rgba(0, 0, 0, 0.22)',
    '0 14px 35px rgba(0, 0, 0, 0.24)',
    '0 16px 38px rgba(0, 0, 0, 0.26)',
    '0 16px 40px rgba(0, 0, 0, 0.28)',
    '0 18px 42px rgba(0, 0, 0, 0.3)',
    '0 18px 45px rgba(0, 0, 0, 0.32)',
    '0 20px 48px rgba(0, 0, 0, 0.34)',
    '0 20px 50px rgba(0, 0, 0, 0.36)',
    '0 22px 52px rgba(0, 0, 0, 0.38)',
    '0 22px 55px rgba(0, 0, 0, 0.4)',
    '0 24px 58px rgba(0, 0, 0, 0.42)',
    '0 24px 60px rgba(0, 0, 0, 0.44)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: '16px',
          lineHeight: 1.5,
          backgroundColor: '#f5f5f7', // --background
          color: '#1d1d1f', // --text-primary
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0071e3', // --primary
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff', // --card-background
          borderRight: '1px solid #e5e5ea', // --divider-color
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // --box-shadow
          borderRadius: 8, // --border-radius
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)', // --box-shadow-hover
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '1.5rem',
          '&:last-child': {
            paddingBottom: '1.5rem',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // --border-radius
          padding: '0.5rem 1rem',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // --border-radius
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderBottom: '1px solid #e5e5ea', // --divider-color
        },
        head: {
          fontWeight: 600,
          color: '#6e6e73', // --text-secondary
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', // --box-shadow
          borderRadius: 8, // --border-radius
        },
      },
    },
    // Estilizando especificamente para cards de estatísticas/indicadores
    MuiTypography: {
      styleOverrides: {
        h4: {
          fontSize: '2.5rem',
          fontWeight: 600,
          lineHeight: 1.2,
        },
      },
    }
  },
});

// Tema escuro
const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    primary: {
      main: '#2997ff', // --primary no tema escuro
      dark: '#0071e3', // --primary-dark no tema escuro
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#86868b', // --secondary no tema escuro
      dark: '#a1a1a6', // --secondary-dark no tema escuro
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff453a', // --danger no tema escuro
    },
    warning: {
      main: '#ff9f0a', // --warning no tema escuro
    },
    info: {
      main: '#64d2ff', // --info no tema escuro
    },
    success: {
      main: '#32d74b', // --success no tema escuro
    },
    text: {
      primary: '#f5f5f7', // --text-primary no tema escuro
      secondary: '#a1a1a6', // --text-secondary no tema escuro
      disabled: '#6e6e73', // --text-disabled no tema escuro
    },
    background: {
      default: '#1d1d1f', // --background no tema escuro
      paper: '#2d2d2f', // --card-background no tema escuro
    },
    divider: '#3d3d3f', // --divider-color no tema escuro
  },
  components: {
    ...theme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1d1d1f', // --background no tema escuro
          color: '#f5f5f7', // --text-primary no tema escuro
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2997ff', // --primary no tema escuro
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2d2d2f', // --card-background no tema escuro
          borderRight: '1px solid #3d3d3f', // --divider-color no tema escuro
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #3d3d3f', // --divider-color no tema escuro
        },
      },
    },
  },
});

// Exportando o tema padrão (claro)
export default theme;

// Exportando ambos os temas para uso com ThemeProvider
export { theme as lightTheme, darkTheme };