import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

// login
export const login = createAsyncThunk(
  'users/login',
  async (data, { rejectWithValue }) => {
    try {
      console.log('data'.data);
      const response = await Api.login(data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);
// login
export const me = createAsyncThunk(
  'users/me',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.me();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);
