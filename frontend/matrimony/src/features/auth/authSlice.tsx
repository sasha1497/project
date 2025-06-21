import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('authToken'),
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('authToken', action.payload);
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
