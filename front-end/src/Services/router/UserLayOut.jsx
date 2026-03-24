import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../components/user/NavBar';
import { useBook } from './../App/slice/Dispatches/BookDispatch';
import { useNotif } from '../App/slice/Dispatches/NotifDispatch';

export default function UserLayOut() {
  const { allBooks, getAllSubject } = useBook();
  const { showMessage } = useNotif();

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        const [allRes, subRes] = await Promise.all([
          allBooks(),
          getAllSubject(),
        ]);
        console.log(allRes, subRes);
      } catch (error) {
        if (isMounted) {
          showMessage({
            message: error?.message || 'Failed to load books',
            type: 'error',
          });
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, [allBooks, showMessage]);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
