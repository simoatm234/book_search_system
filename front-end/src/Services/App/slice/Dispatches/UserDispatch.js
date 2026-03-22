import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
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
} from '../AsyncThunks/UserThunks';

export const useUser = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      fetchAllUsers: () => dispatch(fetchAllUsers()),
      fetchAllUsersTrashed: () => dispatch(fetchAllUsersTrashed()),
      fetchAllActions: () => dispatch(fetchAllActions()),
      StoreUserFromAdmin: (data) => dispatch(StoreUserFromAdmin(data)),
      UpdateUser: ({ id, data }) => dispatch(UpdateUser({ id, data })),
      updateUserPass: ({ id, data }) => dispatch(updateUserPass({ id, data })),
      ForcDeleteUser: (id) => dispatch(ForcDropUser(id)),
      DeleteUser: (id) => dispatch(DropUser(id)),
      restorUser: (id) => dispatch(restorUser(id)),
    };
  });
};
