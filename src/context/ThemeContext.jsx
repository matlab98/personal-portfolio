import { createContext, useContext, useState, useEffect } from 'react';

import {
    getLocalStorageItem,
    setLocalStorageItem,
} from "@/hooks/useLocalStorage";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(false);

    // Guardar preferencia en localStorage (opcional)
    useEffect(() => {
        const saved = getLocalStorageItem('theme') === 'dark';
        setDark(saved);
    }, []);

    useEffect(() => {
        setLocalStorageItem('theme', dark ? 'dark' : 'light');
        
        document.documentElement.setAttribute("data-theme", dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, setDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme }

