import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../App/slice/Dispatches/AuthDispatch';

export default function AdminLayOut() {
  const { user, isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { me } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        await Promise.all([me()]);
      } catch (err) {
        console.error('Initialization failed:', err);
        navigate('/login');
      }
    };

    initializeApp();
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
}
