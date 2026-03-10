import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../App/slice/Dispatches/AuthDispatch';
import SideBar from '../../components/admin/SideBar';
import NavBar from '../../components/admin/NavBar';
import { Api } from '../App/Api';
import Notification from '../../components/Notification';

export default function AdminLayOut() {
  const { user, isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { me, logout } = useAuth();

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

  // handel logout
  const onLogout = async () => {
    try {
      const res = await Api.logout(user.id);
      if (res.status == 200 || res.status == 201) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error(' logout failed :', error);
    }
  };
  return (
    <div className="flex h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      <SideBar user={user} onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Notification />
    </div>
  );
}
