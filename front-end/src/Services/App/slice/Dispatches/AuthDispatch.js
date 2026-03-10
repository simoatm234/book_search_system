import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../Api';
import { login, me } from '../AsyncThunks/AuthThunks';
export const useAuth = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      login: (data) => dispatch(login(data)),
      me: () => dispatch(me()),
    };
  });
};
