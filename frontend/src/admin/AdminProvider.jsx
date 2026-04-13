import React, { useState } from 'react';
import { AdminContext } from './AdminContext';

export default function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sharenest_admin') || 'null'); } catch { return null; }
  });

  const adminLogin = (adminData, token) => {
    setAdmin(adminData);
    localStorage.setItem('sharenest_admin_token', token);
    localStorage.setItem('sharenest_admin', JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('sharenest_admin_token');
    localStorage.removeItem('sharenest_admin');
  };

  return (
    <AdminContext.Provider value={{ admin, isAdmin: !!admin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}
