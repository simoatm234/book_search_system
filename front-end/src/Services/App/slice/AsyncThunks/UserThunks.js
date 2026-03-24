import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

// all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
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
export const fetchAllUsersTrashed = createAsyncThunk(
  'users/fetchAllUsersTrashed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.fetchAllUsersTrashed();
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
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);
// Update users
export const StoreUserFromAdmin = createAsyncThunk(
  'users/StoreUserFromAdmin',
  async (data, { rejectWithValue }) => {
    try {
      const response = await Api.storeUser(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
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
// Update users pass
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
export const ForcDropUser = createAsyncThunk(
  'users/ForcDropUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await Api.forcDeleteUser(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
      );
    }
  }
);
export const DropUser = createAsyncThunk(
  'users/dropUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await Api.deleteUser(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
      );
    }
  }
);
export const restorUser = createAsyncThunk(
  'users/restorUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await Api.restorUser(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed update users'
      );
    }
  }
);
