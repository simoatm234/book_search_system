import { createSlice } from '@reduxjs/toolkit';
import { fetchAllUsers } from './AsyncThunks/UserThunks';
const initialState = {
  ListUsers: {},
  loading: false,
  error: null,
};
export const UserSlice = createSlice({
  name: 'user-Slice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.ListUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
