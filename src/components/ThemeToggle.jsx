import React from 'react';
import { useAppTheme } from '@/context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icono para modo oscuro (luna)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icono para modo claro (sol)

const ThemeToggle = () => {
  const { mode, toggleTheme } = useAppTheme();

  return (
    <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit" aria-label={mode === 'dark' ? "Activar modo claro" : "Activar modo oscuro"}>
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ThemeToggle;
