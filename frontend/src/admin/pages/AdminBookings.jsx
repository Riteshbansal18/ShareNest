import React, { useEffect, useState } from 'react';
import { adminAPI } from '../adminAPI';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
  completed: 'bg-blue-500/20 text-blue-400'
};

const getImg = (img, name) => {
  if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=1e3a5f&color=fff&size=32`;
  return img.startsWith('http') ? img : `http://localhost:5000${img}`;
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [page, status]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getBookings({ page, limit: 15, status });
      setBookings(res.data.bookings);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
      toast.success(`Booking ${newStatus}`);
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Bookings</h2>
          <p className="text-slate-400 text-sm">{total} total bookings</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${status === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50">
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">Tenant</th>
                <th className="text-left px-5 py-3 font-semibold">Property</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Check-in</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Duration</th>
                <th className="text-left px-5 py-3 font-semibold">Amount</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-5 py-4"><div className="h-8 bg-slate-800 rounded animate-pulse"></div></td></tr>
              )) : bookings.map(b => (
                <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img src={getImg(b.tenant?.profileImage, b.tenant?.fullName)} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white text-xs">{b.tenant?.fullName}</p>
                        <p className="text-slate-500 text-xs">{b.tenant?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-white text-xs font-medium line-clamp-1 max-w-[160px]">{b.property?.title}</p>
                    <p className="text-slate-500 text-xs">{b.property?.city}</p>
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">
                    {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-slate-400 text-xs hidden md:table-cell">{b.months} mo</td>
                  <td className="px-5 py-3 text-emerald-400 font-bold text-xs">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                      className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs rounded-lg transition-colors">← Prev</button>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs rounded-lg transition-colors">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
