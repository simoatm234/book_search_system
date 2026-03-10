import { createBrowserRouter } from 'react-router-dom';
import AdminLayOut from './AdminLayOut';
import UserLayOut from './UserLayOut';
import Login from '../../pages/auth/login';
import DashBord from '../../pages/admin/DashBord';
import Home from '../../pages/user/Home';
import CheckAuthPage from '../../pages/auth/CheckAuthPage';
import WelcomPage from '../../pages/WelcomPage';

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
]);
