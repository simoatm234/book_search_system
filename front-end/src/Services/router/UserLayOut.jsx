import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

export default function UserLayOut() {
   const state = useSelector((state) => state);
   console.log(state);
  return (
    <div>
      <Outlet />
    </div>
  );
}
