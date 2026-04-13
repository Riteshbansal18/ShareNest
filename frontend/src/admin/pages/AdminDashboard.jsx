import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../adminAPI';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'];

const StatCard = ({ icon, label, value, sub, color, badge }) => (
  <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-400 text-sm font-semibold">{label}</span>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined text-white text-xl">{icon}</span>
      </div>
    </div>
    <p className="text-3xl font-extrabold text-white">{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    {badge && <span className="mt-2 inline-block bg-red-500/20 text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>}
  </div>
);

const getImg = (img) => img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : null;
const STATUS_COLORS = { pending: 'bg-yellow-500/20 text-yellow-400', confirmed: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await adminAPI.getStats();
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>)}
    </div>
  );

  const { stats, charts, recent } = data;

  // Format chart data
  const signupChartData = charts.monthlySignups.map(d => ({
    name: MONTHS[d._id.month - 1],
    Signups: d.count
  }));

  const bookingChartData = charts.monthlyBookings?.map(d => ({
    name: MONTHS[d._id.month - 1],
    Bookings: d.count,
    Revenue: Math.round(d.revenue / 1000)
  })) || [];

  const cityPieData = charts.cityStats.map(({ _id, count }) => ({ name: _id, value: count }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm mt-1">Real-time platform statistics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="group" label="Total Users" value={stats.users.total.toLocaleString()} sub={`${stats.users.active} active`} color="bg-blue-600" />
        <StatCard icon="home_work" label="Properties" value={stats.properties.total.toLocaleString()} sub={`${stats.properties.active} active`} color="bg-violet-600" />
        <StatCard icon="hotel" label="Bookings" value={stats.bookings.total.toLocaleString()} sub={`${stats.bookings.pending} pending`} color="bg-amber-600" />
        <StatCard icon="currency_rupee" label="Est. Revenue" value={`₹${(stats.revenue / 1000).toFixed(0)}K`} sub="from confirmed bookings" color="bg-emerald-600" />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-green-400 text-xl">check_circle</span>
          </div>
          <div><p className="text-2xl font-bold text-white">{stats.bookings.confirmed}</p><p className="text-xs text-slate-400">Confirmed</p></div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-yellow-400 text-xl">pending</span>
          </div>
          <div><p className="text-2xl font-bold text-white">{stats.bookings.pending}</p><p className="text-xs text-slate-400">Pending</p></div>
        </div>
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-purple-400 text-xl">people</span>
          </div>
          <div><p className="text-2xl font-bold text-white">{stats.roommates.total}</p><p className="text-xs text-slate-400">Roommate Profiles</p></div>
        </div>
        <Link to="/admin/moderation" className="bg-slate-900 rounded-2xl p-4 border border-red-500/30 flex items-center gap-4 hover:border-red-500/60 transition-colors">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-red-400 text-xl">pending_actions</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.moderation?.pending || 0}</p>
            <p className="text-xs text-red-400 font-semibold">Awaiting Review</p>
          </div>
        </Link>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Signups */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">person_add</span> Monthly Signups
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={signupChartData}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="Signups" stroke="#3b82f6" strokeWidth={2} fill="url(#signupGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bookings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">hotel</span> Monthly Bookings
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bookingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="Bookings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City Pie Chart */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">location_city</span> Properties by City
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={cityPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {cityPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Users */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-400">person_add</span> New Users
            </h3>
            <Link to="/admin/users" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {recent.users.map(u => (
              <div key={u._id} className="flex items-center gap-3">
                <img src={getImg(u.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=1e3a5f&color=fff&size=32`}
                  alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{u.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">hotel</span> Recent Bookings
            </h3>
            <Link to="/admin/bookings" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {recent.bookings.map(b => (
              <div key={b._id} className="flex items-center gap-3">
                <img src={getImg(b.tenant?.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.tenant?.fullName || 'U')}&background=1e3a5f&color=fff&size=32`}
                  alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{b.tenant?.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{b.property?.title}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
