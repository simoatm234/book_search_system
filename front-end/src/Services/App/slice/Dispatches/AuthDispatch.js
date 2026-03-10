import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../Api';
import { login, me } from '../AsyncThunks/AuthThunks';
import { logout, toggleDark } from '../authSlice';
export const useAuth = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      login: (data) => dispatch(login(data)),
      logout: () => dispatch(logout()),
      me: () => dispatch(me()),
      toggleDark: () => dispatch(toggleDark()),
    };
  });
};
