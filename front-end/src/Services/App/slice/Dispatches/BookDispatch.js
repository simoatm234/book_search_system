import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AllBooks, AllUserBooks } from '../AsyncThunks/BooksThunks';

export const useBook = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      allBooks: () => dispatch(AllBooks()),
      allUserBook: () => dispatch(AllUserBooks()),
    };
  });
};
