import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

// login
export const login = createAsyncThunk(
  'users/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await Api.login(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

// me
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
