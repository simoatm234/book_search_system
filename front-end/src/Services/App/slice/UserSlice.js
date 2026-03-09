import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  currentUser: {},
  ListUsers: {},
  isAuth: false,
  loading: false,
  error: null,
};
export const UserSlice = createSlice({
  name: 'admin-Slice',
  initialState,
  reducers: {},
  extraReducers: {},
});
