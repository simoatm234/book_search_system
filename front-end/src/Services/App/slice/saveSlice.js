import { createSlice } from '@reduxjs/toolkit';
import {
  allSaves,
  mySaves,
  showSave,
  storeSave,
  deleteSave,
} from './AsyncThunks/SaveThunks';

const initialState = {
  saves: [], // all saved records (admin only)
  save: null, // a single saved record (for view)
  mySaves: [], // current user's saved books
  loading: false,
};

export const saveSlice = createSlice({
  name: 'save',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // allSaves (admin)
      .addCase(allSaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(allSaves.fulfilled, (state, action) => {
        state.saves = action.payload.data;
        state.loading = false;
      })
      .addCase(allSaves.rejected, (state) => {
        state.loading = false;
      })

      // mySaves
      .addCase(mySaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(mySaves.fulfilled, (state, action) => {
        state.mySaves = action.payload.data;
        state.loading = false;
      })
      .addCase(mySaves.rejected, (state) => {
        state.loading = false;
      })
      // showSave
      .addCase(showSave.pending, (state) => {
        state.loading = true;
      })
      .addCase(showSave.fulfilled, (state, action) => {
        state.save = action.payload.data;
        state.loading = false;
      })
      .addCase(showSave.rejected, (state) => {
        state.loading = false;
      })

      // storeSave
      .addCase(storeSave.pending, (state) => {
        state.loading = true;
      })
      .addCase(storeSave.fulfilled, (state, action) => {
        const newSave = action.payload.data;
         state.mySaves.push(newSave);
        state.loading = false;
      })
      .addCase(storeSave.rejected, (state) => {
        state.loading = false;
      })

      // deleteSave
      .addCase(deleteSave.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSave.fulfilled, (state, action) => {
        const saveId = action.meta.arg;
        const NewSaves = state.mySaves.filter((save) => save.id !== saveId);
        state.mySaves = NewSaves;
        state.loading = false;
      })
      .addCase(deleteSave.rejected, (state) => {
        state.loading = false;
      });
  },
});
