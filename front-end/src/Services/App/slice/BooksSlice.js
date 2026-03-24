import { createSlice } from '@reduxjs/toolkit';
import {
  AllBooks,
  AllUserBooks,
  getAllSubject,
  getBySubject,
} from './AsyncThunks/BooksThunks';

const initialState = {
  books: [],
  book: {},
  UserBooks: [],
  subjects: [],
  booksBySubject: {}, // new: object keyed by subject
  loading: false,
};

export const BooksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    readBook: (state, data) => {
      state.loading = true;
      const findBook = state.books.find((b) => b.id == data.payload.id);
      state.book = findBook;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // All books (unchanged)
    builder.addCase(AllBooks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(AllBooks.fulfilled, (state, action) => {
      state.books = action.payload.data;
      state.loading = false;
    });
    builder.addCase(AllBooks.rejected, (state) => {
      state.loading = false;
    });

    // All userBooks (unchanged)
    builder.addCase(AllUserBooks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(AllUserBooks.fulfilled, (state, action) => {
      state.UserBooks = action.payload.data;
      state.loading = false;
    });
    builder.addCase(AllUserBooks.rejected, (state) => {
      state.loading = false;
    });

    // getAllSubject (unchanged)
    builder.addCase(getAllSubject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllSubject.fulfilled, (state, action) => {
      state.subjects = action.payload.subjects;
      state.loading = false;
    });
    builder.addCase(getAllSubject.rejected, (state) => {
      state.loading = false;
    });

    // getBySubject – store books under the subject key
    builder.addCase(getBySubject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBySubject.fulfilled, (state, action) => {
      // Assuming action.meta.arg contains the subject string
      const subject = action.meta.arg; 
      state.booksBySubject[subject] = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getBySubject.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { readBook } = BooksSlice.actions;
