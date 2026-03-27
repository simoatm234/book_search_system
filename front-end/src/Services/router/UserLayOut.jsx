import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../../components/user/NavBar';
import { useBook } from './../App/slice/Dispatches/BookDispatch';
import { useNotif } from '../App/slice/Dispatches/NotifDispatch';
import { useSelector } from 'react-redux';
import Footer from '../../components/user/Footer';
import AuthUser from '../../components/user/AuthUser';
import { useAuth } from '../App/slice/Dispatches/AuthDispatch';
import LoadingUser from '../../components/user/LoadingUser';
import { Api } from '../App/Api';
import Notification from '../../components/Notification';

export default function UserLayOut() {
  const { showMessage } = useNotif();
  const { setOpenAuth, showUser, logout } = useAuth();
  const { OpenAuth, token, userId, isAuth, loading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        // get user auth
        if (token && userId && isAuth) {
          await showUser(userId);
        } else {
          setOpenAuth();
          logout();
        }
      } catch (error) {
        if (isMounted) {
          showMessage({
            message: error?.message || 'Failed to load books',
            type: 'error',
          });
        }
      }
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!OpenAuth && !token && !isAuth && !userId) {
        setOpenAuth(true);
      }
    }, 600000);

    return () => clearTimeout(timer);
  }, []);

  const onLogout = async () => {
    try {
      if (confirm('are you shur')) {
        const res = await Api.logout(userId);
        if (res.status == 200 || res.status == 201) {
          logout();
          navigate('/login');
        }
      }
      return;
    } catch (error) {
      console.error(' logout failed :', error);
    }
  };

  return (
    <div>
      <NavBar onLogout={onLogout} />
      <Outlet />
      <Footer />
       <Notification />
      {OpenAuth && <AuthUser />}
      {loading && <LoadingUser />}
    </div>
  );
}
