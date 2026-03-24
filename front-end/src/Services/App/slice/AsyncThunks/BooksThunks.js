import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

export const AllBooks = createAsyncThunk(
  'Books/allBooks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.allBooks();
      return res.data;
    } catch (error) {
         return rejectWithValue(
           error.response?.data?.message || 'Failed to fetch books'
         );
    }
  }
);
export const AllUserBooks = createAsyncThunk(
  'Books/allUserBooks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.getAllUserBooks();
      return res.data;
    } catch (error) {
         return rejectWithValue(
           error.response?.data?.message || 'Failed to fetch books'
         );
    }
  }
);
export const getAllSubject = createAsyncThunk(
  'Books/getAllSubject',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.getAllSubject();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const getBySubject = createAsyncThunk(
  'Books/getBySubject',
  async (subject, { rejectWithValue }) => {
    try {
      const res = await Api.getBySubject(subject);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
