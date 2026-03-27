import { createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../Api';

export const AllBooks = createAsyncThunk(
  'Books/allBooks',
  async (newPage, { rejectWithValue }) => {
    try {
      const res = await Api.allBooks(newPage);
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const getBook = createAsyncThunk(
  'Books/getBook',
  async (bookId, { rejectWithValue }) => {
    try {
      const res = await Api.showBook(bookId);
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
export const getAllBooksWithSubject = createAsyncThunk(
  'Books/getAllBooksWithSubject',
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.getAllBooksWithSubjects();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch books'
      );
    }
  }
);
export const getbookBySubject = createAsyncThunk(
  'books/getbookBySubject',
  async ({ subject, page }, { rejectWithValue }) => {
    try {
      const res = await Api.getBookBySubject({ subject, page });

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to fetch books for this subject'
      );
    }
  }
);
