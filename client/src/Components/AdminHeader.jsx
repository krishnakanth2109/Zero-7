// File: rc/Components/AdminHeader.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { PanelLeftClose, PanelRightClose, User, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const AdminHeader = ({ toggleSidebar, isOpen }) => {
  const [user, setUser] = useState({ name: 'Admin', email: '', role: '', id: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const getCookieData = () => {
      try {
        const userData = Cookie.get('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    };
    getCookieData();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    navigate(notification.link || '/admin/dashboard');
    setShowNotifications(false);
    markAllAsRead();
  };

  const handleLogout = () => {
    Cookie.remove('token');
    Cookie.remove('user');
    window.location.href = '/admin';
  };

  return (
    <header className='bg-white p-3 flex items-center justify-between sticky top-0 left-0 z-40 shadow-sm pe-4'>
      
      {/* Left side - Toggle Button (Line removed and spacing fixed) */}
      <div className='flex items-center'>
        <button 
          type='button' 
          onClick={toggleSidebar}
          className="p-2 text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-lg transition-all"
        >
          {isOpen ? <PanelLeftClose size={24} /> : <PanelRightClose size={24} />}
        </button>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-3'>
        {/* Notifications */}
        <div className='relative' ref={notificationRef}>
          <button
            className='relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className='absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden'>
              <div className='flex items-center justify-between p-4 border-b bg-gray-50/50'>
                <h3 className='text-sm font-bold text-gray-800'>Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className='text-xs text-blue-600 hover:underline font-medium'>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`flex items-start p-4 hover:bg-blue-50/30 cursor-pointer border-b transition-colors ${n.unread ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-gray-900 truncate'>{n.title}</p>
                        <p className='text-xs text-gray-600 mt-1 line-clamp-2'>{n.message}</p>
                        <p className='text-[10px] text-gray-400 mt-1'>{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='p-10 text-center text-gray-400 text-xs'>No notifications</div>
                )}
              </div>
              <button onClick={() => navigate('/admin/view-requests')} className='w-full p-3 text-xs text-center font-bold text-blue-600 border-t hover:bg-gray-50'>
                View All Requests
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className='relative' ref={userMenuRef}>
          <button
            className='flex items-center gap-3 p-1.5 pr-3 text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className='relative'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold'>
                <User size={20} />
              </div>
              <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></div>
            </div>
            <div className='hidden md:block text-left'>
              <p className='text-xs font-bold text-gray-900 leading-tight'>{user.name}</p>
              <p className='text-[10px] uppercase tracking-wider font-bold text-blue-600'>{user.role}</p>
            </div>
          </button>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden'>
              <div className='p-4 border-b bg-gray-50/50'>
                <p className='text-sm font-bold text-gray-900'>{user.name}</p>
                <p className='text-xs text-gray-500 truncate'>{user.email}</p>
              </div>
              <div className='py-1'>
                <button onClick={() => navigate(`/admin/userPage/${user.id}`)} className='w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100'>
                  Profile Settings
                </button>
                <button onClick={handleLogout} className='w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50'>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;