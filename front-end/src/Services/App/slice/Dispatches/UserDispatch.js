import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '../../Api';

export const useUser = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {};
  });
};
