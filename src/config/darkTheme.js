import { createTheme } from '@mui/material/styles';

// Paleta de colores "Nord" (versión dark)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#39D3BB', // Verde acento
    },
    secondary: {
      main: '#5E81AC', // Un azul secundario, podemos ajustarlo si es necesario
    },
    background: {
      default: '#23272F', // Fondo principal oscuro
      paper: '#2A2F3A',   // Fondo de tarjetas/contenedores secundarios
    },
    text: {
      primary: '#F0F0F0',   // Texto principal claro
      secondary: '#A0A0A0', // Texto secundario
    },
    // Puedes añadir más colores de la paleta Nord aquí
    // error: { main: '#BF616A' }, // Nord11 - Rojo
    // warning: { main: '#D08770' }, // Nord13 - Naranja
    // info: { main: '#B48EAD' }, // Nord15 - Púrpura
    // success: { main: '#A3BE8C' }, // Nord14 - Verde
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    // Puedes personalizar más variantes aquí
  },
  // Personalizaciones de componentes específicos para el modo oscuro
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#2A2F3A', // Fondo del AppBar un poco diferenciado
          color: '#F0F0F0'
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #3A3F4A', // Un borde sutil para las tarjetas
        }
      }
    }
    // Añade más personalizaciones de componentes aquí
  },
});

export default darkTheme; 