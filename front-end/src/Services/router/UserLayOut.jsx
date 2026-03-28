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
import { useSave } from '../App/slice/Dispatches/SaveDispatch';

export default function UserLayOut() {
  const { showMessage } = useNotif();
  const { setOpenAuth, showUser, logout } = useAuth();
  const { fetchMySaves } = useSave();
  const { OpenAuth, token, userId, isAuth, loading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      try {
        if (token && userId && isAuth) {
          await showUser(userId);
          await fetchMySaves();
        } else {
          setOpenAuth();
          logout();
        }
      } catch (error) {
        if (isMounted) {
          showMessage({
            message: error?.message || 'Failed to load user data',
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
    }, 600000); // 10 minutes
    return () => clearTimeout(timer);
  }, [OpenAuth]);

  const onLogout = async () => {
    try {
      if (window.confirm('Are you sure you want to log out?')) {
        const res = await Api.logout(userId);
        if (res.status === 200 || res.status === 201) {
          logout();
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      <NavBar onLogout={onLogout} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Notification />
      {OpenAuth && <AuthUser />}
      {loading && <LoadingUser />}
    </div>
  );
}
