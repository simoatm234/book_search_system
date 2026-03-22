import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Services/router/Router';
import { Api } from './Services/App/Api';

export default function App() {
  useEffect(() => {
    const fetchScrf = async () => {
      await Api.getCsrfCookie();
    };
  }, []);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
