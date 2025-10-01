// File: src/Pages/AdminLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import AdminNotifications from '../Components/AdminNotifications';
import { NotificationProvider } from '../context/NotificationContext';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // 1. The Provider should be the top-level wrapper for the entire layout.
    <NotificationProvider>
      <div className='bg-slate-50 h-screen'>
        {/* 2. The Sidebar is rendered once. It's positioned independently with CSS. */}
        <AdminSidebar isOpen={isSidebarOpen} />

        {/* 3. This is the main content area that adjusts its margin based on the sidebar state. */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-20'} 
          `}>
          
          {/* 
            4. Both components that use the notification context are now correctly placed
               *inside* the Provider's scope.
          */}
          <AdminNotifications />
          <AdminHeader toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
          
          <main className='p-4 sm:p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}