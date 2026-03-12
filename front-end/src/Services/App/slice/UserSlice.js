import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllActions,
  fetchAllUsers,
  UpdateUser,
  updateUserPass,
} from './AsyncThunks/UserThunks';
const initialState = {
  users: [],
  actions: [],
  loading: false,
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
        state.users = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // update
    builder
      .addCase(UpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data || action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // update pass
    builder
      .addCase(updateUserPass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPass.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserPass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // actions
    builder
      .addCase(fetchAllActions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActions.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload.data;
      })
      .addCase(fetchAllActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
