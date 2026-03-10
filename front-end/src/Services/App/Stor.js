import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './slice/UserSlice';
import { authSlice } from './slice/authSlice';

export const stor = configureStore({
  reducer: {
    user: UserSlice.reducer,
    auth: authSlice.reducer,
  },
});
