import React, { useState, useRef, useEffect } from 'react'
import Cookie from 'js-cookie'
import { PanelLeftClose, PanelRightClose } from 'lucide-react'

const AdminHeader = ({ toggleSidebar, isOpen }) => {
  const [user, setUser] = useState({ email: '', role: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New Application Received',
      message: 'John Doe has applied for React Developer position',
      time: '2 mins ago',
      unread: true,
    },
    {
      id: 2,
      type: 'success',
      title: 'Interview Scheduled',
      message: 'Interview with Sarah Johnson scheduled for tomorrow',
      time: '10 mins ago',
      unread: true,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Batch Starting Soon',
      message: 'Full Stack Development batch starts in 2 days',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'Platform maintenance scheduled for this weekend',
      time: '3 hours ago',
      unread: false,
    },
  ])

  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    const getCookieData = () => {
      const userData = Cookie.get('user')
      const payload = JSON.parse(userData)
      setUser(payload)
    }
    getCookieData()

    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality here
    }
  }

  const handleLogout = () => {
    Cookie.remove('token')
    window.location.href = '/admin'
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '📋'
    }
  }

  return (
    <header className='bg-white border-gray-200 p-3 flex items-center justify-around sticky top-0 left-0 z-40 shadow-sm'>
      {/* Left side - Search Bar */}
      <div className='mr-2'>
        <button type='button' onClick={toggleSidebar}>
          {isOpen ? <PanelLeftClose /> : <PanelRightClose />}
        </button>
      </div>
      <div className='flex-1'>
        <div className='w-72 max-md:w-32'>
          <input
            type='search'
            placeholder='search'
            className='w-full bg-gray-200 '
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Right side - Notifications and User Menu */}
      <div className='flex items-center gap-2'>
        {/* Notifications */}
        <div className='relative' ref={notificationRef}>
          <button
            className='relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label='Notifications'>
            <svg className='h-6 w-6' viewBox='0 0 20 20' fill='currentColor'>
              <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
            </svg>
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-pulse'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
              <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'>
                    Mark all as read
                  </button>
                )}
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}>
                      <div className='flex-shrink-0 mr-3'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            notification.type === 'success'
                              ? 'bg-green-100 text-green-600'
                              : notification.type === 'warning'
                              ? 'bg-yellow-100 text-yellow-600'
                              : notification.type === 'error'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                          <span>{getNotificationIcon(notification.type)}</span>
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium text-gray-900 truncate'>
                          {notification.title}
                        </div>
                        <div className='text-sm text-gray-600 mt-1'>
                          {notification.message}
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          {notification.time}
                        </div>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-600 rounded-full flex-shrink-0'></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='p-8 text-center'>
                    <span className='text-4xl mb-4 block'>🔔</span>
                    <p className='text-gray-500'>No notifications yet</p>
                  </div>
                )}
              </div>
              <div className='p-4 border-t border-gray-200'>
                <button className='w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar and Menu */}
        <div className='relative' ref={userMenuRef}>
          <button
            className='flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label='User menu'>
            <div className='relative'>
              <img
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format'
                alt='Admin Avatar'
                className='w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm'
              />
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></div>
            </div>
            <div className='hidden md:block text-left'>
              <div className='text-sm font-medium text-gray-900'>
                {user.name}
              </div>
              {user.role === 'Admin' && (
                <span class='bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300'>
                  {user.role}
                </span>
              )}
              {user.role === 'manager' && (
                <span class='bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300'>
                  {user.role}
                </span>
              )}
              {user.role === 'recruiter' && (
                <span class='bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-green-900 dark:text-green-300'>
                  {user.role}
                </span>
              )}
            </div>
            <svg
              className='w-4 h-4 text-gray-400'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          {showUserMenu && (
            <div className='absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50'>
              <div className='flex items-center p-4 border-b border-gray-200'>
                <div className='flex-shrink-0'>
                  <img
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face&auto=format'
                    alt='Admin Avatar'
                    className='w-12 h-12 rounded-full object-cover'
                  />
                </div>
                <div className='ml-3 flex-1'>
                  <div className='text-sm font-medium text-gray-900'>
                    {user.role === 'superAdmin' ? 'superAdmin' : user.name}
                  </div>
                  <span className='text-[12px] text-gray-500'>
                    {user.email}
                  </span>
                </div>
              </div>

              <div className='py-2'>
                <button className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                  <svg
                    className='w-4 h-4 mr-3 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <button className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                  <svg
                    className='w-4 h-4 mr-3 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>Account Settings</span>
                </button>

                <button className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                  <svg
                    className='w-4 h-4 mr-3 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789-.973zm-2.692-3.442a4.002 4.002 0 01.487-4.785L6.842 3.898a6.04 6.04 0 00-.544 2.157 5.993 5.993 0 00.045 4.456zm4.692.654a4.002 4.002 0 01-4.785.487l-1.54 1.54A5.99 5.99 0 0010 14c.657 0 1.29-.106 1.885-.298l-1.05-1.05z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>Help & Support</span>
                </button>

                <hr className='my-2 border-gray-200' />

                <button
                  className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                  onClick={handleLogout}>
                  <svg
                    className='w-4 h-4 mr-3 text-red-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
