import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import lightTheme from '@/config/lightTheme'; // Asegúrate que la ruta @/config sea correcta
import darkTheme from '@/config/darkTheme';   // Asegúrate que la ruta @/config sea correcta
import { getLocalStorageItem, setLocalStorageItem } from "@/hooks/useLocalStorage";

const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
});

const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = getLocalStorageItem('themeMode') || 'light';
    setMode(savedMode);
  }, []);

  const themeManager = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          setLocalStorageItem('themeMode', newMode);
          // Ya no manipulamos data-theme directamente aquí, MUI se encargará
          return newMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const activeTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeModeContext.Provider value={themeManager}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline /> {/* Normaliza estilos y aplica color de fondo del tema */}
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

const useAppTheme = () => useContext(ThemeModeContext);

export { AppThemeProvider, useAppTheme };

