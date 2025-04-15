import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Apple-inspired theme context
const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

// Hook for accessing the theme
export const useThemeMode = () => useContext(ThemeContext);

// Custom ThemeProvider
export const ThemeProvider = ({ children }) => {
  // Check for saved theme preference
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('themeMode');
    // Check system preference if no saved preference
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  };

  // State for theme mode
  const [mode, setMode] = useState(getSavedTheme());

  // Toggle between light and dark themes
  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Apple-inspired light theme
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#0071e3', // Apple blue
        light: '#42a5f5',
        dark: '#0050a1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#86868b', // Apple gray
        light: '#a1a1a6',
        dark: '#6e6e73',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ff3b30', // Apple red
      },
      warning: {
        main: '#ff9500', // Apple orange
      },
      info: {
        main: '#007aff', // Apple blue for info
      },
      success: {
        main: '#34c759', // Apple green
      },
      text: {
        primary: '#1d1d1f', // Apple dark text
        secondary: '#86868b', // Apple secondary text
      },
      background: {
        default: '#f5f5f7', // Apple light background
        paper: '#ffffff', // White for cards/papers
      },
      divider: '#d2d2d7', // Apple divider color
    },
    typography: {
      fontFamily: '"SF Pro Display", "Inter", "Roboto", "Helvetica Neue", sans-serif',
      h1: {
        fontWeight: 600,
        fontSize: '2.5rem',
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        letterSpacing: '-0.025em',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        letterSpacing: '-0.025em',
      },
      body1: {
        fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica Neue", sans-serif',
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica Neue", sans-serif',
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12, // Apple's rounded corners
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 12,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            borderRadius: 12,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 600,
            textTransform: 'none',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(210, 210, 215, 0.5)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid #d2d2d7',
            padding: '16px',
          },
          head: {
            fontWeight: 600,
            backgroundColor: 'rgba(245, 245, 247, 0.6)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            minWidth: 100,
            transition: 'all 0.3s ease',
            '&.Mui-selected': {
              color: '#0071e3',
            },
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
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              transition: 'border-color 0.3s ease',
              '& fieldset': {
                borderColor: '#d2d2d7',
              },
              '&:hover fieldset': {
                borderColor: '#86868b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0071e3',
              },
            },
          },
        },
      },
    },
  });

  // Apple-inspired dark theme
  const darkTheme = createTheme({
    ...lightTheme,
    palette: {
      mode: 'dark',
      primary: {
        main: '#0a84ff', // Apple blue for dark mode
        light: '#5eb3ff',
        dark: '#0064d1',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#86868b', // Apple gray
        light: '#a1a1a6',
        dark: '#6e6e73',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ff453a', // Apple red for dark mode
      },
      warning: {
        main: '#ff9f0a', // Apple orange for dark mode
      },
      info: {
        main: '#64d2ff', // Apple blue for info in dark mode
      },
      success: {
        main: '#32d74b', // Apple green for dark mode
      },
      text: {
        primary: '#f5f5f7', // Apple light text for dark mode
        secondary: '#a1a1a6', // Apple secondary text for dark mode
      },
      background: {
        default: '#1d1d1f', // Apple dark background
        paper: '#2d2d2f', // Dark mode paper
      },
      divider: '#424245', // Apple divider color for dark mode
    },
    components: {
      ...lightTheme.components,
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#1d1d1f',
            color: '#f5f5f7',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#2d2d2f',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(29, 29, 31, 0.8)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(66, 66, 69, 0.5)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'rgba(45, 45, 47, 0.9)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: 'rgba(45, 45, 47, 0.8)',
          },
          root: {
            borderBottom: '1px solid #424245',
          },
        },
      },
    },
  });

  // Use the theme based on the mode
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  // Update the data-theme attribute for CSS customization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Context value with current theme and toggle function
  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;