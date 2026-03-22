import { createSlice } from '@reduxjs/toolkit';
import {
  DropUser,
  fetchAllActions,
  fetchAllUsers,
  fetchAllUsersTrashed,
  ForcDropUser,
  restorUser,
  StoreUserFromAdmin,
  UpdateUser,
  updateUserPass,
} from './AsyncThunks/UserThunks';

const initialState = {
  users: [],
  deletedUsers: [],
  actions: [],
  loading: false,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // FETCH ALL USERS
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // FETCH ALL USERS TRASHED
    builder
      .addCase(fetchAllUsersTrashed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsersTrashed.fulfilled, (state, action) => {
        state.loading = false;
        state.deletedUsers = action.payload.data || action.payload;
      })
      .addCase(fetchAllUsersTrashed.rejected, (state) => {
        state.loading = false;
      });

    //  STORE USER FROM ADMIN
    builder
      .addCase(StoreUserFromAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(StoreUserFromAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const newUser = action.payload.data || action.payload;
        if (newUser) {
          state.users.push(newUser);
        }
      })
      .addCase(StoreUserFromAdmin.rejected, (state) => {
        state.loading = false;
      });

    // UPDATE USER
    builder
      .addCase(UpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data || action.payload;
        const index = state.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(UpdateUser.rejected, (state) => {
        state.loading = false;
      });

    //  UPDATE USER PASSWORD
    builder
      .addCase(updateUserPass.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserPass.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUserPass.rejected, (state) => {
        state.loading = false;
      });

    //  FETCH ALL ACTIONS
    builder
      .addCase(fetchAllActions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllActions.fulfilled, (state, action) => {
        state.loading = false;
        state.actions = action.payload.data || action.payload;
      })
      .addCase(fetchAllActions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FORCE DELETE USER
    builder
      .addCase(ForcDropUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(ForcDropUser.fulfilled, (state, action) => {
        state.loading = false;
        // Remove user from both users and deletedUsers arrays
        const userId = action.payload;
        state.users = state.users.filter((u) => u.id !== userId);
        state.deletedUsers = state.deletedUsers.filter((u) => u.id !== userId);
      })
      .addCase(ForcDropUser.rejected, (state) => {
        state.loading = false;
      });

    //  SOFT DELETE USER
    builder
      .addCase(DropUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(DropUser.fulfilled, (state, action) => {
      state.loading = false;
      const userId = action.payload?.id || action.payload;

      // Find the user in active users
      const deletedUser = state.users.find((u) => u.id === userId);

      if (deletedUser) {
        // Remove from active users
        state.users = state.users.filter((u) => u.id !== userId);

        // Add to deleted users with deleted_at timestamp
        state.deletedUsers.push({
          ...deletedUser,
          deleted_at: new Date().toISOString(),
        });
      }
      })
      .addCase(DropUser.rejected, (state) => {
        state.loading = false;
      });

    //  RESTORE USER
    builder
      .addCase(restorUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(restorUser.fulfilled, (state, action) => {
        state.loading = false;
        const restoredUser = action.payload.data || action.payload;
        const userId = restoredUser.id;

        const findUser = state.deletedUsers.find((u) => u.id == userId);
        if (findUser) {
          state.users.push({ ...findUser, deleted_at: null });
          state.deletedUsers.pop(findUser);
        }
      })
      .addCase(restorUser.rejected, (state) => {
        state.loading = false;
      });
  },
});
