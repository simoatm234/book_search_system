import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../App/slice/Dispatches/AuthDispatch';
import SideBar from '../../components/admin/SideBar';
import { Api } from '../App/Api';
import Notification from '../../components/Notification';
import Loading from '../../components/admin/Loading';

export default function AdminLayOut() {
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showUser, logout } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('userId');
      if (!token && !id) {
        navigate('/login');
        return;
      }

      try {
        const response = await showUser(id);
        if (!response.payload?.success) {
          logout();
          navigate('/login');
        }
        return;
      } catch (err) {
        console.error('Initialization failed:', err);
        logout();
        navigate('/login');
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return <Loading />;
  }
  // handel logout
  const onLogout = async () => {
    try {
      if (confirm('are you shur')) {
        const res = await Api.logout(user.id);
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
    <div className="flex h-screen bg-[#F4F0E6] dark:bg-[#1A1208] transition-colors duration-300">
      <SideBar user={user} onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <Notification />
    </div>
  );
}
