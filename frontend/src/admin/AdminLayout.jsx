import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import toast from 'react-hot-toast';

const NAV = [
  { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/users', icon: 'group', label: 'Users' },
  { path: '/admin/properties', icon: 'home_work', label: 'Properties' },
  { path: '/admin/bookings', icon: 'hotel', label: 'Bookings' },
  { path: '/admin/moderation', icon: 'pending_actions', label: 'Moderation' },
  { path: '/admin/settings', icon: 'settings', label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const { admin, adminLogout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    adminLogout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-white text-sm">admin_panel_settings</span>
          </div>
          {!collapsed && <span className="font-extrabold text-white tracking-tight">ShareNest</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(({ path, icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span className="material-symbols-outlined text-xl flex-shrink-0">{icon}</span>
                {!collapsed && <span className="text-sm font-semibold">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <span className="material-symbols-outlined text-xl flex-shrink-0">open_in_new</span>
            {!collapsed && <span className="text-sm font-semibold">View Site</span>}
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <span className="material-symbols-outlined text-xl flex-shrink-0">logout</span>
            {!collapsed && <span className="text-sm font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">{collapsed ? 'menu_open' : 'menu'}</span>
            </button>
            <h1 className="text-sm font-semibold text-slate-300 capitalize">
              {NAV.find(n => n.path === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{admin?.fullName}</p>
              <p className="text-xs text-slate-400">{admin?.email}</p>
            </div>
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              {admin?.fullName?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
