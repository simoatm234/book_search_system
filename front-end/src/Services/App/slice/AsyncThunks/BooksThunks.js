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
