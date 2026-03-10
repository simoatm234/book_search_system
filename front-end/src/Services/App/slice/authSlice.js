import { createSlice } from '@reduxjs/toolkit';
import { login, me } from './AsyncThunks/AuthThunks';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuth: !!localStorage.getItem('token'),
  dark: JSON.parse(localStorage.getItem('dark')) ?? false,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuth = false;

      localStorage.removeItem('token');
    },

    toggleDark: (state) => {
      state.dark = !state.dark;
      localStorage.setItem('dark', JSON.stringify(state.dark));
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuth = true;
        localStorage.setItem('token', action.payload.token);
      })

      .addCase(login.rejected, (state) => {
        state.loading = false;
       
      })

      // ME
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })

      .addCase(me.rejected, (state, ) => {
        state.loading = false;
        state.isAuth = false;
      });
  },
});

export const { logout, toggleDark } = authSlice.actions;
