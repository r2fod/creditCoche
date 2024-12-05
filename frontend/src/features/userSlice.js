import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // Estado inicial del usuario
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Actualiza el estado con la información del usuario
    },
    logout: (state) => {
      state.user = null; // Limpiar el estado del usuario cuando se desloguea
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
