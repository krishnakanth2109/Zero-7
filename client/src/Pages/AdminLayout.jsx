import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import AdminHeader from "../Components/AdminHeader";
import AdminNotifications from "../Components/AdminNotifications";
import { NotificationProvider } from "../context/NotificationContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <NotificationProvider>
      <div className="admin-layout">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className={`admin-main ${isSidebarOpen ? "expanded" : "collapsed"}`}>
          <AdminHeader
            toggleSidebar={() => setIsSidebarOpen(p => !p)}
            isOpen={isSidebarOpen}
          />

          <AdminNotifications />

          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
