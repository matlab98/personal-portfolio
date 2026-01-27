import { createTheme } from '@mui/material/styles';

// Paleta de colores "Nord" (versión light)
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#39D3BB', // Verde acento (mismo que en dark)
    },
    secondary: {
      main: '#5E81AC', // Azul secundario (mismo que en dark)
    },
    background: {
      default: '#F8F9FA', // Fondo principal claro
      paper: '#FFFFFF',   // Fondo de tarjetas/contenedores secundarios (blanco)
    },
    text: {
      primary: '#212529',   // Texto principal oscuro
      secondary: '#6C757D', // Texto secundario
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
  },
  // Personalizaciones de componentes específicos para el modo claro
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#FFFFFF', // AppBar blanco en modo claro
          color: '#212529',     // Texto oscuro en AppBar
          boxShadow: '0 2px 4px -1px rgba(0,0,0,0.06)' // Sombra sutil para AppBar claro
        },
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E9ECEF', // Borde sutil para tarjetas en modo claro
        }
      }
    }
    // Añade más personalizaciones aquí
  },
});

export default lightTheme; 