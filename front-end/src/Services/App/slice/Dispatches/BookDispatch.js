import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { AllBooks, AllUserBooks, getAllSubject, getBySubject } from '../AsyncThunks/BooksThunks';
import { readBook } from '../BooksSlice';

export const useBook = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      allBooks: () => dispatch(AllBooks()),
      getAllSubject: () => dispatch(getAllSubject()),
      getBySubject: (subject) => dispatch(getBySubject(subject)),
      allUserBook: () => dispatch(AllUserBooks()),
      readBook: (payload) => dispatch(readBook(payload)),
    };
  });
};
