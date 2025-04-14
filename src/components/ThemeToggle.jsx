



    /* 
        const change = () => {
            const newTheme = Body.getAttribute("data-theme") === "dark" ? "light" : "dark";
            Body.setAttribute("data-theme", newTheme);
            const isDarkMode = newTheme === "dark";
            setLocalStorageItem("dark-mode", isDarkMode.toString());
            setMode(isDarkMode.toString());
        }; */

import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: dark ? '#333' : '#ddd',
        color: dark ? '#fff' : '#000',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default ThemeToggle;
