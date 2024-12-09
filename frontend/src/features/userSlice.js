// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Estado inicial del slice de usuario
const initialState = {
  user: null, // Por defecto, no hay usuario
};

// Creación del slice de Redux
const userSlice = createSlice({
  name: 'user', // Nombre del slice
  initialState, // Estado inicial
  reducers: {
    // Acción para establecer el usuario
    setUser: (state, action) => {
      console.log('Estableciendo usuario en Redux:', action.payload);
      state.user = action.payload; // Guardamos los datos del usuario en el estado
    },
    // Acción para cerrar sesión
    logout: (state) => {
      console.log('Cerrando sesión, limpiando usuario de Redux');
      state.user = null; // Eliminamos al usuario del estado
    },
  },
});

// Exportamos las acciones y el reducer
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;