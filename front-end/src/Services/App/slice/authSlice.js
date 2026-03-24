import { createSlice } from '@reduxjs/toolkit';
import { login, showUser } from './AsyncThunks/AuthThunks';

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

      localStorage.clear();
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
        localStorage.setItem('userId', action.payload.data.id);
      })

      .addCase(login.rejected, (state) => {
        state.loading = false;
      })

      // ME
      .addCase(showUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(showUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuth = true;
      })

      .addCase(showUser.rejected, (state) => {
        state.loading = false;
        state.isAuth = false;
      });
  },
});

export const { logout, toggleDark } = authSlice.actions;
