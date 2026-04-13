import React, { useEffect, useState } from 'react';
import { adminAPI } from '../adminAPI';
import toast from 'react-hot-toast';

const getImg = (img, name) => {
  if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=1e3a5f&color=fff&size=64`;
  return img.startsWith('http') ? img : `http://localhost:5000${img}`;
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => { load(); }, [page, status]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getUsers({ page, limit: 15, search, status });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await adminAPI.getUser(id);
      setSelected(res.data);
    } catch (e) { toast.error('Failed to load user'); }
    finally { setDetailLoading(false); }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.user.isActive } : u));
      if (selected?.user?._id === id) setSelected(prev => ({ ...prev, user: { ...prev.user, isActive: res.data.user.isActive } }));
      toast.success(res.data.message);
    } catch (e) { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      setSelected(null);
      toast.success('User deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const setVerification = async (id, level) => {
    try {
      await adminAPI.verifyUser(id, level);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, verificationLevel: level } : u));
      toast.success('Verification updated');
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Users</h2>
          <p className="text-slate-400 text-sm">{total} total users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-56"
              placeholder="Search name or email..." />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">Search</button>
        </form>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50">
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-semibold">User</th>
                <th className="text-left px-5 py-3 font-semibold hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 font-semibold hidden lg:table-cell">Joined</th>
                <th className="text-left px-5 py-3 font-semibold">Verified</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-left px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? [...Array(8)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-8 bg-slate-800 rounded animate-pulse"></div></td></tr>
              )) : users.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={getImg(u.profileImage, u.fullName)} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-white">{u.fullName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{u.location || '—'}</td>
                  <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.verificationLevel > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                      L{u.verificationLevel}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openDetail(u._id)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="View">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                      <button onClick={() => toggleStatus(u._id)} className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-amber-400 transition-colors" title="Toggle Status">
                        <span className="material-symbols-outlined text-sm">{u.isActive ? 'block' : 'check_circle'}</span>
                      </button>
                      <button onClick={() => deleteUser(u._id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* User Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-slate-900 h-full overflow-y-auto border-l border-slate-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">User Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-5 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <img src={getImg(selected.user.profileImage, selected.user.fullName)} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h4 className="text-xl font-bold text-white">{selected.user.fullName}</h4>
                  <p className="text-slate-400 text-sm">{selected.user.email}</p>
                  <p className="text-slate-500 text-xs mt-1">{selected.user.occupation || 'No occupation'}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Location', value: selected.user.location || '—' },
                  { label: 'Gender', value: selected.user.gender || '—' },
                  { label: 'Phone', value: selected.user.phone || '—' },
                  { label: 'Joined', value: new Date(selected.user.createdAt).toLocaleDateString('en-IN') },
                  { label: 'Last Seen', value: new Date(selected.user.lastSeen).toLocaleDateString('en-IN') },
                  { label: 'Google Auth', value: selected.user.googleId ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              {/* Verification Control */}
              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-sm font-semibold text-white mb-3">Verification Level</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map(l => (
                    <button key={l} onClick={() => setVerification(selected.user._id, l)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${selected.user.verificationLevel === l ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                      L{l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => toggleStatus(selected.user._id)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${selected.user.isActive ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                  {selected.user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteUser(selected.user._id)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                  Delete User
                </button>
              </div>

              {/* Properties */}
              {selected.properties?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Listings ({selected.properties.length})</p>
                  <div className="space-y-2">
                    {selected.properties.map(p => (
                      <div key={p._id} className="bg-slate-800 rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-white truncate">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.city} · ₹{p.price?.toLocaleString('en-IN')}/mo</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.isActive ? 'Active' : 'Off'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bookings */}
              {selected.bookings?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-white mb-3">Bookings ({selected.bookings.length})</p>
                  <div className="space-y-2">
                    {selected.bookings.map(b => (
                      <div key={b._id} className="bg-slate-800 rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-white truncate">{b.property?.title}</p>
                          <p className="text-xs text-slate-500">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                          b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
