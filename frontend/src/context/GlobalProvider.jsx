import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { GlobalContext } from './GlobalContext';
import { propertiesAPI, roommatesAPI, favoritesAPI, notificationsAPI } from '../api/services';
import { connectSocket, disconnectSocket, getSocket } from '../api/socket';

export default function GlobalProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sharenest_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sharenest_token') || null);

  const [properties, setProperties] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [favoriteRoommates, setFavoriteRoommates] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [roommatesLoading, setRoommatesLoading] = useState(false);

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sharenest_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('sharenest_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sharenest_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const isAuthenticated = !!token && !!user;

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('sharenest_token', authToken);
    localStorage.setItem('sharenest_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setFavoriteProperties([]);
    setFavoriteRoommates([]);
    setNotifications([]);
    setUnreadCount(0);
    disconnectSocket();
    localStorage.removeItem('sharenest_token');
    localStorage.removeItem('sharenest_user');
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sharenest_user', JSON.stringify(updatedUser));
  };

  const fetchProperties = useCallback(async (params = {}) => {
    setPropertiesLoading(true);
    try {
      const res = await propertiesAPI.getAll(params);
      setProperties(res.data.properties);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      return null;
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  const fetchRoommates = useCallback(async (params = {}) => {
    setRoommatesLoading(true);
    try {
      const res = await roommatesAPI.getAll(params);
      setRoommates(res.data.roommates);
      return res.data;
    } catch (error) {
      console.error('Failed to fetch roommates:', error);
      return null;
    } finally {
      setRoommatesLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await favoritesAPI.getAll();
      const propFavs = res.data.favorites.filter(f => f.type === 'property').map(f => f.property?._id);
      const roomFavs = res.data.favorites.filter(f => f.type === 'roommate').map(f => f.roommate?._id);
      setFavoriteProperties(propFavs.filter(Boolean));
      setFavoriteRoommates(roomFavs.filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  }, [isAuthenticated]);

  const toggleFavoriteProperty = async (propertyId) => {
    if (!isAuthenticated) { toast.error('Please login to save favorites'); return; }
    try {
      const res = await favoritesAPI.toggleProperty(propertyId);
      if (res.data.favorited) {
        setFavoriteProperties(prev => [...prev, propertyId]);
        toast.success('Added to favorites ❤️');
      } else {
        setFavoriteProperties(prev => prev.filter(id => id !== propertyId));
        toast.success('Removed from favorites');
      }
    } catch { toast.error('Failed to update favorites'); }
  };

  const toggleFavoriteRoommate = async (roommateId) => {
    if (!isAuthenticated) { toast.error('Please login to save favorites'); return; }
    try {
      const res = await favoritesAPI.toggleRoommate(roommateId);
      if (res.data.favorited) {
        setFavoriteRoommates(prev => [...prev, roommateId]);
        toast.success('Added to favorites ❤️');
      } else {
        setFavoriteRoommates(prev => prev.filter(id => id !== roommateId));
        toast.success('Removed from favorites');
      }
    } catch { toast.error('Failed to update favorites'); }
  };

  useEffect(() => { fetchProperties(); fetchRoommates(); }, [fetchProperties, fetchRoommates]);
  useEffect(() => { if (isAuthenticated) fetchFavorites(); }, [isAuthenticated, fetchFavorites]);

  // Socket + Notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (e) { /* silent */ }
  }, [isAuthenticated]);

  const markAllRead = async () => {
    await notificationsAPI.readAll();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    await notificationsAPI.delete(id);
    setNotifications(prev => prev.filter(n => n._id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const socket = connectSocket(user._id);

    socket.on('notification:new', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast(notif.title, { icon: '🔔', duration: 4000 });
    });

    socket.on('users:online', (userIds) => {
      setOnlineUsers(userIds);
    });

    fetchNotifications();

    return () => {
      socket.off('notification:new');
      socket.off('users:online');
    };
  }, [isAuthenticated, user?._id]);

  return (
    <GlobalContext.Provider value={{
      user, token, isAuthenticated, login, logout, updateUser,
      properties, roommates, propertiesLoading, roommatesLoading,
      favoriteProperties, favoriteRoommates,
      toggleFavoriteProperty, toggleFavoriteRoommate,
      fetchProperties, fetchRoommates, fetchFavorites,
      notifications, unreadCount, markAllRead, deleteNotification, fetchNotifications,
      onlineUsers,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </GlobalContext.Provider>
  );
}
