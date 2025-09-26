// AdminLayout.jsx
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../Components/AdminSidebar'
import AdminHeader from '../Components/AdminHeader'
import AdminNotifications from '../Components/AdminNotifications'
import './AdminLayout.css'

export default function AdminLayout() {
  const [open, setOpen] = useState(true)

  const onToggleSidebar = () => {
    setOpen(!open)
  }
  return (
    <div
      className={`flex h-screen overflow-none flex-grow transition-all duration-300 ease-in-out ${
        open ? 'ml-64' : 'ml-0'
      }`}>
      <AdminSidebar isOpen={open} />
      <AdminNotifications /> {/* Always mounted */}
      <div className='flex-1 flex flex-col'>
        <AdminHeader toggleSidebar={onToggleSidebar} isOpen={open} />
        <main className='overflow-scroll p-4'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
