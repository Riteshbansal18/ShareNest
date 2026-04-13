import React, { useState } from 'react';
import { adminAPI } from '../adminAPI';
import { useAdmin } from '../AdminContext';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { admin } = useAdmin();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error('All fields required'); return;
    }
    setLoading(true);
    try {
      await adminAPI.createAdmin(form);
      toast.success('New admin created!');
      setForm({ fullName: '', email: '', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Admin panel configuration</p>
      </div>

      {/* Current Admin Info */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-400">manage_accounts</span>
          Current Admin
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white">
            {admin?.fullName?.[0]}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{admin?.fullName}</p>
            <p className="text-slate-400 text-sm">{admin?.email}</p>
            <span className="text-xs bg-blue-600/20 text-blue-400 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">Super Admin</span>
          </div>
        </div>
      </div>

      {/* Create New Admin */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400">person_add</span>
          Create New Admin
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
            <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Admin Name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="admin@sharenest.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Min 8 characters" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Creating...</> : 'Create Admin Account'}
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">info</span>
          Admin Capabilities
        </h3>
        <ul className="space-y-2 text-sm text-slate-400">
          {[
            'View all users, properties, and bookings',
            'Activate or deactivate user accounts',
            'Verify properties and set verification levels',
            'Approve or reject new property listings (moderation)',
            'Manage booking statuses (confirm, cancel, complete)',
            'Delete users and properties permanently',
            'Create additional admin accounts',
            'View platform revenue and analytics',
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
