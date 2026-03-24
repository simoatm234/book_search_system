import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null, 
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },

    clearMessage: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { showMessage, clearMessage } = notificationSlice.actions;
