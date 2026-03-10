import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

// all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async ({ rejectWithValue }) => {
    try {
      const response = await Api.fetchAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

