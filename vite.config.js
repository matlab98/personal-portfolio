import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Se importa defineConfig de 'vite' y no de 'vitest/config' para que `vite build`
// siga funcionando aunque vitest no esté instalado (registry inalcanzable).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // alias @ apunta a src/
    },
  },
  build: {
    rollupOptions: {
      output: {
        // El chunk principal llegaba a ~904 kB porque MUI, Firebase, i18n y Redux
        // caían todos en el entry. Separarlos deja que el navegador los cachee
        // entre despliegues: un cambio de copy no invalida el vendor de MUI.
        //
        // Regla: solo se agrupa a mano lo que ya es alcanzable desde el entry.
        // Mezclar en un mismo chunk una dependencia eager con una que solo usa
        // una sección lazy vuelve eager a las dos, y eso engorda el primer paint.
        // Por eso no hay chunk 'vendor' de cajón de sastre: lo que no encaje se
        // devuelve como undefined y lo reparte Rollup con el grafo real.
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;

          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'vendor-firebase';
          // Charts: solo lo que NO es alcanzable desde el entry. La sección de
          // métricas es lazy, así que este chunk debe quedar fuera del
          // modulepreload inicial. Ojo: d3-* e internmap sí son alcanzables en
          // eager, y meterlos aquí arrastra todo el chunk al primer paint.
          if (
            /\/(recharts|recharts-scale|victory-vendor|react-smooth|decimal\.js-light|fast-equals|lodash)\//.test(id)
          ) {
            return 'vendor-charts';
          }
          if (
            id.includes('/@mui/') ||
            id.includes('/@emotion/') ||
            /\/(@popperjs|react-transition-group|stylis)\//.test(id)
          ) {
            return 'vendor-mui';
          }
          if (/\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return 'vendor-motion';
          if (id.includes('i18next')) return 'vendor-i18n';
          if (id.includes('/@reduxjs/') || /\/(react-redux|immer|reselect)\//.test(id)) {
            return 'vendor-redux';
          }
          // Después de i18next/redux para no robarles react-i18next ni react-redux.
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router') ||
            id.includes('/scheduler/')
          ) {
            return 'vendor-react';
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/hooks/**'],
      exclude: ['src/**/*.{test,spec}.{js,jsx}', 'src/test/**'],
    },
  },
});
