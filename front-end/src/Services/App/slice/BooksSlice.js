import { createSlice } from '@reduxjs/toolkit';
import {
  AllBooks,
  AllUserBooks,
  getAllBooksWithSubject,
  getBook,
  getbookBySubject,
} from './AsyncThunks/BooksThunks';

const initialState = {
  books: null,
  book: null,
  myBooks: [],
  UserBooks: [],
  bookBySubject: null,
  booksBySubject: null,
  loading: false,
};

export const BooksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
   
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
    // show books
    builder.addCase(getBook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBook.fulfilled, (state, action) => {
      state.book = action.payload.data;
      state.loading = false;
    });
    builder.addCase(getBook.rejected, (state) => {
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

    // getAllBooksWithSubject (unchanged)
    builder.addCase(getAllBooksWithSubject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllBooksWithSubject.fulfilled, (state, action) => {
    
      state.booksBySubject = action.payload.subjects;
      state.loading = false;
    });
    builder.addCase(getAllBooksWithSubject.rejected, (state) => {
      state.loading = false;
    });

    // getBookBySubject
    builder.addCase(getbookBySubject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getbookBySubject.fulfilled, (state, action) => {
      const data = action.payload;
      state.bookBySubject = data
      state.loading =false
    });
    builder.addCase(getbookBySubject.rejected, (state) => {
      state.loading = false;
    });
  },
});

// export const {  } = BooksSlice.actions;
