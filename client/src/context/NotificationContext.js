// File: src/context/NotificationContext.js

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios'; // Make sure you have a configured axios instance

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioContextRef = useRef(null);
    const audioUnlockedRef = useRef(false);

    const unlockAudio = useCallback(/* ... (no changes to this function) ... */);
    const playSound = useCallback(/* ... (no changes to this function) ... */);

    // Effect for Socket connection and initial data fetch
    useEffect(() => {
        const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // --- FETCH HISTORICAL NOTIFICATIONS ---
        const fetchInitialNotifications = async () => {
            try {
                const response = await api.get('/notifications');
                const fetchedNotifications = response.data.map(n => ({
                    id: n._id,
                    ...n,
                    time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                }));
                setNotifications(fetchedNotifications);
                const initialUnread = fetchedNotifications.filter(n => n.unread).length;
                setUnreadCount(initialUnread);
            } catch (error) {
                console.error("Failed to fetch initial notifications:", error);
            }
        };
        fetchInitialNotifications();
        // ------------------------------------

        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("touchstart", unlockAudio, { once: true });

        return () => {
            newSocket.close();
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };
    }, [unlockAudio]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(), // Temporary key for React
            ...notification,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 50));
        setUnreadCount(prev => prev + 1);

        playSound();
        if (Notification.permission === "granted") {
            new Notification(notification.title, {
                body: notification.message,
                icon: "/logo192.png",
            });
        }
    }, [playSound]);

    // Effect for all Socket event listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => console.log('✅ Socket connected successfully via Context'));
        socket.on('connect_error', (err) => console.error('❌ Socket connection error:', err.message));
        
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
        
        // --- ADDED: Listeners for new events ---
        socket.on('newJobPosting', (data) => addNotification({
            title: 'New Job Posting',
            message: data.message,
            type: 'info',
            link: '/admin/manage-jobs'
        }));
        socket.on('newCandidateAdded', (data) => addNotification({
            title: 'New Candidate Added',
            message: data.message,
            type: 'success',
            link: '/admin/manage-candidates'
        }));
        // ------------------------------------

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('newInfoRequest');
            socket.off('newApplication');
            socket.off('newEnrollment');
            socket.off('newFormSubmission');
            socket.off('newJobPosting'); // Cleanup
            socket.off('newCandidateAdded'); // Cleanup
        };
    }, [socket, addNotification]);

    const markAllAsRead = useCallback(async () => {
        // Optimistic UI update
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

        // --- API CALL TO UPDATE BACKEND ---
        try {
            await api.put('/notifications/mark-all-read');
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
            // Optional: Revert UI change on API call failure
        }
        // ---------------------------------
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