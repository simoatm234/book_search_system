import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

export const allSaves = createAsyncThunk(
  'save/allAaves',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.allSaves();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const mySaves = createAsyncThunk(
  'save/mySaves',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.mySaves();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const showSave = createAsyncThunk(
  'save/showSave',
  async (saveId, { rejectWithValue }) => {
    try {
      const res = await Api.getSave(saveId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const storeSave = createAsyncThunk(
  'save/storeSave',
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.storeSave(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const deleteSave = createAsyncThunk(
  'save/deleteSave',
  async (saveId, { rejectWithValue }) => {
    try {
      const res = await Api.deleteSave(saveId);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
