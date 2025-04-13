import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

// Criar contexto para gerenciamento de tema
const ThemeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

// Hook para acessar o tema atual e a função de toggle
export const useThemeMode = () => useContext(ThemeContext);

// Provider de tema personalizado
export const ThemeProvider = ({ children }) => {
  // Verificar se o usuário tem preferência salva de tema
  const getSavedTheme = () => {
    const savedTheme = localStorage.getItem('themeMode');
    // Verificar preferência do sistema se não houver preferência salva
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return savedTheme;
  };

  // Estado para armazenar o modo do tema
  const [mode, setMode] = useState(getSavedTheme());

  // Função para alternar entre temas claro e escuro
  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Memorizar o tema atual para evitar recriação desnecessária
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );

  // Atualizar o atributo data-theme no documento para CSS customizado
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Contexto com valores atuais
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