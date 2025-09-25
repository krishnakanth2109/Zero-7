// AdminLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../Components/AdminSidebar'
import AdminHeader from '../Components/AdminHeader'
import AdminNotifications from '../Components/AdminNotifications'
import './AdminLayout.css'

export default function AdminLayout() {
  return (
    <div className='admin-layout'>
      <AdminSidebar />
      <AdminNotifications /> {/* Always mounted */}
      <div className='flex-1 flex flex-col'>
        <AdminHeader />
        <main className='admin-content p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
