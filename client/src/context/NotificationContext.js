// File: src/context/NotificationContext.js

import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Create the context
const NotificationContext = createContext();

// 2. Create a custom hook for easy access
export const useNotifications = () => {
    return useContext(NotificationContext);
};

// 3. Create the Provider component
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        // Add the new notification to the top of the list
        setNotifications(prev => [
            { ...notification, id: Date.now(), time: 'Just now', unread: true },
            ...prev
        ]);
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => 
            prev.map(n => n.unread ? { ...n, unread: false } : n)
        );
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    // The value that will be available to all consumer components
    const value = {
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};