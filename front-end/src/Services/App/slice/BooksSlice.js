import { createSlice } from '@reduxjs/toolkit';
import { AllBooks } from './AsyncThunks/BooksThunks';
const initialState = {
  books: [],
  book: {},
  loading: false,
};
export const BooksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //All books
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
  },
});
