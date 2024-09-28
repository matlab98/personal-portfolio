import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../features/services/statistics'; // Importa el archivo donde definirás el API

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Configura los listeners para las solicitudes automáticas
setupListeners(store.dispatch);

export default store;
