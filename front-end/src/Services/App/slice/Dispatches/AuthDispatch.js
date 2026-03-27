import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../Api';
import { login, showUser } from '../AsyncThunks/AuthThunks';
import { logout, setOpenAuth, toggleDark, updateUserAuth } from '../authSlice';
export const useAuth = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      login: (data) => dispatch(login(data)),
      updateUserAuth: ({ id, data }) => {
        dispatch(updateUserAuth({ id, data }));
      },
      logout: () => dispatch(logout()),
      showUser: (id) => dispatch(showUser(id)),
      toggleDark: () => dispatch(toggleDark()),
      setOpenAuth: () => dispatch(setOpenAuth()),
    };
  });
};
