// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/AdminSidebar";
import AdminNotifications from "../Components/AdminNotifications";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <AdminNotifications /> {/* Always mounted */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
