// components/Layout/Layout.js
import React from 'react';
import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet /> {/* This renders the nested routes */}
      </main>
    </>
  );
};

export default Layout;
