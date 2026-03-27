import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  AllBooks,
  AllUserBooks,
  getAllBooksWithSubject,
  getBook,
  getbookBySubject,
} from '../AsyncThunks/BooksThunks';

export const useBook = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      allBooks: (newPage) => dispatch(AllBooks(newPage)),
      getBook: (id) => dispatch(getBook(id)),
      getBooksBySubject: () => dispatch(getAllBooksWithSubject()),
      getbookBySubject: ({ subject, page }) =>
        dispatch(getbookBySubject({ subject, page })),
      allUserBook: () => dispatch(AllUserBooks()),
    };
  });
};
