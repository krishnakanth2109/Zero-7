// File: src/context/NotificationContext.js (Corrected for Create React App)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// 1. Create the context
const NotificationContext = createContext(null);

// 2. Create a custom hook for easy access
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

// 3. Create the Provider component
export const NotificationProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // This effect establishes the socket connection
    useEffect(() => {
        // --- THIS IS THE FIX ---
        // Use process.env for Create React App, which reads from your .env file.
        const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Cleanup on component unmount
        return () => newSocket.close();
    }, []);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            ...notification,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + 1);
    }, []);

    // This effect sets up all the event listeners on the socket
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => console.log('✅ Socket connected successfully'));
        
        socket.on('newInfoRequest', (data) => addNotification({
            title: 'New Candidate Request',
            message: data.message,
            type: 'info',
            link: '/admin/view-requests'
        }));

        socket.on('newApplication', (data) => addNotification({
            title: 'New Job Application',
            message: data.message,
            type: 'success',
            link: '/admin/applications'
        }));

        socket.on('newEnrollment', (data) => addNotification({
            title: 'New Enrollment',
            message: data.message,
            type: 'info',
            link: '/admin/studentenrollment'
        }));

        socket.on('newFormSubmission', (data) => addNotification({
            title: 'New Contact Message',
            message: `From ${data.name} regarding "${data.purpose}"`,
            type: 'warning',
            link: '/admin/forms'
        }));

        return () => {
            socket.off('connect');
            socket.off('newInfoRequest');
            socket.off('newApplication');
            socket.off('newEnrollment');
            socket.off('newFormSubmission');
        };
    }, [socket, addNotification]);

    const markAllAsRead = useCallback(() => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }, []);

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