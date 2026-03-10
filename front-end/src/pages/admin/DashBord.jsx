import React from 'react';
import { useSelector } from 'react-redux';

export default function DashBord() {
  const { user } = useSelector((state) => state.auth);
  return <div>{JSON.stringify(user)}</div>;
}
