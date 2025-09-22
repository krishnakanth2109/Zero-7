import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";
import "./AdminSidebar.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openServices, setOpenServices] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // Highlight services submenu if active
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
    location.pathname === "/admin/it-programs" ||
    location.pathname === "/admin/non-it-programs";

  // Fetch initial new forms count
  useEffect(() => {
    const fetchNewForms = async () => {
      try {
        const res = await axios.get(`${API_URL}/forms/count-new`);
        setNewCount(res.data.count ?? 0);
      } catch (err) {
        console.error("Failed to fetch form count:", err);
      }
    };
    fetchNewForms();
  }, []);

  // Reset count if user visits /admin/forms
  useEffect(() => {
    if (location.pathname === "/admin/forms") {
      setNewCount(0);
    }
  }, [location.pathname]);

  // Setup socket for live updates
  useEffect(() => {
    const socket = io(API_URL.replace("/api", ""));
    socket.on("newFormSubmission", () => {
      setNewCount((prev) => prev + 1);
    });
    return () => socket.disconnect();
  }, []);

  // Logout handler
  const handleLogout = () => {
    // Corrected the key to match your PrivateRoute component if it uses 'isAdmin'
    localStorage.removeItem("isAdmin"); 
    navigate("/admin");
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar-header">Admin Panel</div>

        <nav>
          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`sidebar-link ${
              isActive("/admin/dashboard") ? "active" : ""
            }`}
          >
            Dashboard
          </Link>

          {/* Services Dropdown */}
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
                  className={`sidebar-link ${
                    isActive("/admin/it-programs") ? "active" : ""
                  }`}
                >
                  IT Services
                </Link>
                <Link
                  to="/admin/non-it-programs"
                  className={`sidebar-link ${
                    isActive("/admin/non-it-programs") ? "active" : ""
                  }`}
                >
                  Non IT Services
                </Link>
              </div>
            )}
          </div>

          {/* Form Submissions */}
          <Link
            to="/admin/forms"
            className={`sidebar-link ${
              isActive("/admin/forms") ? "active" : ""
            }`}
          >
            Form Submissions
            <span
              className={`notification-badge ${newCount === 0 ? "zero" : ""}`}
            >
              {newCount}
            </span>
          </Link>
          
          {/* ----- LINKS ADDED HERE ----- */}
          <Link
            to="/admin/manage-jobs"
            className={`sidebar-link ${
              isActive("/admin/manage-jobs") ? "active" : ""
            }`}
          >
            Manage Jobs
          </Link>
          <Link
            to="/admin/applications"
            className={`sidebar-link ${
              isActive("/admin/applications") ? "active" : ""
            }`}
          >
            View Applications
          </Link>
         <Link
  to="/admin/new-batch-dashboard"
  className={`sidebar-link ${
    isActive("/admin/new-batch-dashboard") ? "active" : ""
  }`}
>
  New Batches
</Link>
          {/* ----------------------------- */}

        </nav>
      </div>

      {/* Logout Button at Bottom */}
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={18} style={{ marginRight: "8px" }} />
        Logout
      </button>
    </aside>
  );
}