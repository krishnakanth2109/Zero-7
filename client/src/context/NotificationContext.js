// File: src/context/NotificationContext.js (Consolidated & Corrected)

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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

    // --- START: Logic moved from AdminNotifications.jsx ---
    const audioContextRef = useRef(null);
    const audioUnlockedRef = useRef(false);

    // Function to unlock the browser's audio context, required for autoplay
    const unlockAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
        }
        if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
        }
        audioUnlockedRef.current = true;
        // Remove the event listener after the first interaction
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("touchstart", unlockAudio);
    }, []);

    // Function to play a notification sound
    const playSound = useCallback(async () => {
        try {
            if (!audioUnlockedRef.current) await unlockAudio();
            // Ensure you have a sound file at /public/sounds/notification.wav
            const audio = new Audio("/sounds/notification.wav");
            await audio.play();
        } catch (err) {
            console.log("🔔 Sound blocked by browser or file not found:", err);
        }
    }, [unlockAudio]);
    // --- END: Logic moved from AdminNotifications.jsx ---

    // This effect establishes the socket connection
    useEffect(() => {
        const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // --- START: Added audio unlock and permission request logic ---
        // Request browser notification permission when the app loads
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
        // Add event listeners for the first user interaction to unlock audio
        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("touchstart", unlockAudio, { once: true });
        // --- END: Added logic ---

        return () => {
            newSocket.close();
            // Clean up event listeners on unmount
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };
    }, [unlockAudio]);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            id: Date.now(),
            ...notification,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: true,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 20));
        setUnreadCount(prev => prev + 1);

        // --- START: Added sound and browser notification triggers ---
        playSound();
        if (Notification.permission === "granted") {
            new Notification(notification.title, {
                body: notification.message,
                icon: "/logo192.png", // Make sure this icon exists in your /public folder
            });
        }
        // --- END: Added triggers ---

    }, [playSound]);

    // This effect sets up all the event listeners on the socket
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

        return () => {
            socket.off('connect');
            socket.off('connect_error');
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