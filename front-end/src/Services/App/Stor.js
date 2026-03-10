import { configureStore } from '@reduxjs/toolkit';
import { UserSlice } from './slice/UserSlice';
import { authSlice } from './slice/authSlice';
import { notificationSlice } from './slice/notificationSlice';

export const stor = configureStore({
  reducer: {
    user: UserSlice.reducer,
    auth: authSlice.reducer,
    notification: notificationSlice.reducer,
  },
});
