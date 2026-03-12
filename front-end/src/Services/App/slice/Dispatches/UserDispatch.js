import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../Api';
import {
  fetchAllActions,
  fetchAllUsers,
  UpdateUser,
  updateUserPass,
} from '../AsyncThunks/UserThunks';

export const useUser = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      fetchAllUsers: () => dispatch(fetchAllUsers()),
      fetchAllActions: () => dispatch(fetchAllActions()),
      UpdateUser: ({ id, data }) => dispatch(UpdateUser({ id, data })),
      updateUserPass: ({ id, data }) => dispatch(updateUserPass({ id, data })),
    };
  });
};
