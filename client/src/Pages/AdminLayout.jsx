// File: src/Pages/AdminLayout.jsx (Corrected)

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../Components/AdminSidebar';
import AdminHeader from '../Components/AdminHeader';
import AdminNotifications from '../Components/AdminNotifications';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* AdminSidebar is positioned fixed via its own CSS */}
      <AdminSidebar isOpen={isSidebarOpen} />
      <AdminNotifications />

      {/* --- This wrapper gets a dynamic margin to stay clear of the fixed sidebar --- */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-64' : 'ml-20'} 
        `}
      >
        <AdminHeader toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <main className='p-4 sm:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}