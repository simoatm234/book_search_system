import React, { useEffect } from 'react';
import { useBook } from '../../Services/App/slice/Dispatches/BookDispatch';
import { useSelector } from 'react-redux';

export default function MapBooks({ subject }) {
  const { getBySubject } = useBook();
  const { booksBySubject } = useSelector((state) => state.books);
  useEffect(() => {
    const fetch = async () => {
        const res = await getBySubject(subject);
        
    };
  }, []);
  return <div>{subject}</div>;
}
