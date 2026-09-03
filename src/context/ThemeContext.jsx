import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';

import lightTheme from '@/config/lightTheme';
import darkTheme from '@/config/darkTheme';
import toCssVariables from '@/config/cssVars';
import { getLocalStorageItem, setLocalStorageItem } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'themeMode';

const DEFAULT_MODE = 'dark';

const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: DEFAULT_MODE,
});

/**
 * Preferencia guardada > oscuro.
 *
 * El portafolio está diseñado en oscuro, así que `prefers-color-scheme` no
 * participa: un visitante con el sistema en claro vería la versión secundaria
 * del diseño sin haberla pedido. El toggle sigue mandando y persistiendo.
 */
const resolveInitialMode = () => {
  const saved = getLocalStorageItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return DEFAULT_MODE;
};

const AppThemeProvider = ({ children }) => {
  // Resolver en el initializer evita el parpadeo claro→oscuro del primer paint.
  const [mode, setMode] = useState(resolveInitialMode);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const nextMode = prevMode === 'light' ? 'dark' : 'light';
      setLocalStorageItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  }, []);

  const themeManager = useMemo(() => ({ toggleTheme, mode }), [toggleTheme, mode]);
  const activeTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  return (
    <ThemeModeContext.Provider value={themeManager}>
      <MuiThemeProvider theme={activeTheme}>
        <CssBaseline />
        <GlobalStyles styles={toCssVariables} />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
};

const useAppTheme = () => useContext(ThemeModeContext);

export { AppThemeProvider, useAppTheme };
