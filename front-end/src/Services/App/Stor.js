import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './slice/UserSlice';

export const stor = configureStore({
  reducer: {
    user: UserSlice.reducer,
  },
});
