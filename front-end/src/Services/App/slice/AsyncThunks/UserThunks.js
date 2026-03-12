import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

// all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.fetchAllUsers();
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);
export const fetchAllActions = createAsyncThunk(
  'users/fetchAllActions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.fetchAllActions();
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);
// Update users
export const UpdateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await Api.updateUser({ id, data });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
      );
    }
  }
);
// Update users
export const updateUserPass = createAsyncThunk(
  'users/updatePass',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await Api.updateUserPass({ id, data });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
      );
    }
  }
);
