import { createBrowserRouter } from 'react-router-dom';
import AdminLayOut from './AdminLayOut';
import UserLayOut from './UserLayOut';
import Login from '../../pages/auth/login';
import DashBord from '../../pages/admin/DashBord';
import Home from '../../pages/user/Home';
import CheckAuthPage from '../../pages/auth/CheckAuthPage';
import WelcomPage from '../../pages/WelcomPage';
import Register from '../../pages/auth/Register';
import AcountConfirmation from '../../pages/auth/AcountConfirmation';
import ForgotPassword from '../../pages/auth/forgotPassword';
import ConfirmeCode from '../../pages/auth/ConfirmeCode';
import ResetPassword from '../../pages/auth/ResetPassword';

export const router = createBrowserRouter([
  // admin routers
  {
    path: '/admin/',
    element: <AdminLayOut />,
    children: [
      {
        path: 'dashboard',
        element: <DashBord />,
      },
    ],
  },
  // user routers
  {
    path: '/user/',
    element: <UserLayOut />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
    ],
  },
  // auther routers
  {
    path: '/',
    element: <WelcomPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/SheckAuthPage',
    element: <CheckAuthPage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/confirm-email/:token',
    element: <AcountConfirmation />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/Confirme-code',
    element: <ConfirmeCode />,
  },
  {
    path: '//reset-password',
    element: <ResetPassword />,
  },
]);
