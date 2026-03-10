import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CheckAuthPage() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    switch (user?.role) {
      case 'user':
        navigate('/user/home');
        break;

      case 'admin':
        navigate('/admin/dashboard');
        break;

      default:
        navigate('/');
    }
  }, [isAuth, user, navigate]);

  return <div>Checking authentication...</div>;
}
