import { createSlice } from '@reduxjs/toolkit';
import { login, me } from './AsyncThunks/AuthThunks';
const initialState = {
  user: {},
  token: localStorage.getItem('token') || null,
  isAuth: !!localStorage.getItem('token'),
  dark: false,
  loading: false,
  error: null,
};
export const authSlice = createSlice({
  name: 'auth-Slice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuth = true;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //   me
    builder
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })

      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
      });
  },
});
