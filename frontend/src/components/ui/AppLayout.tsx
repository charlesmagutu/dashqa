import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;