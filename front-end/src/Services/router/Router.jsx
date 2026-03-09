import { createBrowserRouter } from 'react-router-dom';
import AdminLayOut from './AdminLayOut';
import UserLayOut from './UserLayOut';
import Login from '../../pages/auth/login';

export const router = createBrowserRouter([
  {
    path: '/admin/',
    element: <AdminLayOut />,
    children: [
      {
        index: true,
      },
    ],
  },
  {
    path: '/user/',
    element: <UserLayOut />,
    children: [],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
