// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Importar el reducer de usuario

// Configuración del store
const store = configureStore({
  reducer: {
    user: userReducer, // Registramos el reducer de usuario
  },
});

export default store;
