import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const location = useLocation();
  const [openServices, setOpenServices] = useState(false);

  useEffect(() => {
    if (
      location.pathname === "/admin/it-programs" ||
      location.pathname === "/admin/non-it-programs"
    ) {
      setOpenServices(true);
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isSubmenuActive =
    isActive("/admin/it-programs") || isActive("/admin/non-it-programs");

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">Admin Panel</div>

      <nav>
        <Link
          to="/admin/dashboard"
          className={`sidebar-link ${isActive("/admin/dashboard") ? "active" : ""}`}
        >
          Dashboard
        </Link>

        <div className="dropdown-container">
          <div
            onClick={() => setOpenServices(!openServices)}
            className={`sidebar-link flex justify-between items-center services-header ${
              isSubmenuActive ? "active" : ""
            }`}
          >
            <span>Services</span>
            <ChevronDown
              size={18}
              className={`dropdown-arrow ${openServices ? "rotate" : ""}`}
            />
          </div>

          {openServices && (
            <div className="submenu">
              <Link
                to="/admin/it-programs"
                className={`sidebar-link ${isActive("/admin/it-programs") ? "active" : ""}`}
              >
                IT Services
              </Link>
              <Link
                to="/admin/non-it-programs"
                className={`sidebar-link ${isActive("/admin/non-it-programs") ? "active" : ""}`}
              >
                Non IT Services
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
