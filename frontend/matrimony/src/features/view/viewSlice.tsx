import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewState {
  users: any[];
}

const initialState: ViewState = {
  users: [],
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<any[]>) => {
      state.users = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
    }
  },
});

export const { setUsers, clearUsers } = viewSlice.actions;
export default viewSlice.reducer;
