import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('authUser') || 'null'), // ✅ Store entire user object
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('authUser', JSON.stringify(action.payload)); // ✅ full user
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
