import { useMemo } from 'react';
import { clearMessage, showMessage } from '../notificationSlice';
import { useDispatch } from 'react-redux';

export const useNotif = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      showMessage: (mesage) => dispatch(showMessage(mesage)),
      clearMessage: () => dispatch(clearMessage()),
    };
  });
};
