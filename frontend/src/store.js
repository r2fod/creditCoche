import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice'; // Importar el reducer de usuario (debe ser creado)

const store = configureStore({
  reducer: {
    user: userReducer, // Aquí se registran los reducers
  },
});

export default store;
