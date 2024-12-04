import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with fixed position */}
      <div className="w-64 h-full fixed top-0 left-0 bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Main content that fills the available space */}
      <main className="flex-1 ml-64 p-4 overflow-auto h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
