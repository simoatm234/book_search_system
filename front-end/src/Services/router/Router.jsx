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
import Profile from '../../pages/admin/Profile';
import AllUsers from '../../pages/admin/AllUsers';
import StoreUser from '../../components/admin/StoreUser';
import Actions from '../../pages/admin/Actions';
import AllBooks from '../../pages/admin/AllBooks';
import AllUserBook from '../../pages/admin/AllUserBook';
import ReadBook from '../../pages/admin/ReadBook';

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
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'show/users',
        element: <AllUsers />,
      },
      {
        path: 'action/users',
        element: <Actions />,
      },
      {
        path: 'books/all',
        element: <AllBooks />,
      },
      {
        path: 'books/read/:bookId',
        element: <ReadBook />,
      },
      {
        path: 'books/user-book-action',
        element: <AllUserBook />,
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
