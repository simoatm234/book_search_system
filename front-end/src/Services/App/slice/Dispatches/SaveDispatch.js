import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  allSaves,
  deleteSave,
  mySaves,
  showSave,
  storeSave,
} from '../AsyncThunks/SaveThunks';

export const useSave = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      allSaves: () => dispatch(allSaves()),
      fetchMySaves: () => dispatch(mySaves()),
      showSave: (saveId) => dispatch(showSave(saveId)),
      storeSave: (data) => dispatch(storeSave(data)),
      deleteSave: (saveId) => dispatch(deleteSave(saveId)),
    };
  });
};
