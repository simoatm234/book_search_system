import React from 'react'
import {  RouterProvider } from 'react-router-dom';
import { router } from './Services/router/Router';

export default function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}
