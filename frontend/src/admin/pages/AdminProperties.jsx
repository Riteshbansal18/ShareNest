import React, { useEffect, useState } from 'react';
import { adminAPI } from '../adminAPI';
import toast from 'react-hot-toast';

const getImg = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
  return img.startsWith('http') ? img : `http://localhost:5000${img}`;
};

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [page, city, status]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getProperties({ page, limit: 15, search, city, status });
      setProperties(res.data.properties);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const verify = async (id) => {
    try {
      await adminAPI.verifyProperty(id);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, verified: true } : p));
      toast.success('Property verified ✓');
    } catch (e) { toast.error('Failed'); }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await adminAPI.togglePropertyStatus(id);
      setProperties(prev => prev.map(p => p._id === id ? { ...p, isActive: res.data.property.isActive } : p));
      toast.success(res.data.message);
    } catch (e) { toast.error('Failed'); }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm('Delete this property permanently?')) return;
    try {
      await adminAPI.deleteProperty(id);
      setProperties(prev => prev.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch (e) { toast.error('Failed'); }
  };

  const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Properties</h2>
          <p className="text-slate-400 text-sm">{total} total listings</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-48"
              placeholder="Search title or city..." />
          </div>
          <select value={city} onChange={e => { setCity(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors">Search</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? [...Array(9)].map((_, i) => (
          <div key={i} className="h-64 bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>
        )) : properties.map(p => (
          <div key={p._id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden group">
            <div className="relative h-40 overflow-hidden">
              <img src={getImg(p.images?.[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                {p.verified && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{p.title}</h3>
              <p className="text-slate-400 text-xs flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-xs">location_on</span>{p.neighborhood || p.city}, {p.city}
              </p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-400 font-extrabold">₹{p.price?.toLocaleString('en-IN')}/mo</span>
                <div className="flex items-center gap-1.5">
                  <img src={p.owner?.profileImage
                    ? (p.owner.profileImage.startsWith('http') ? p.owner.profileImage : `http://localhost:5000${p.owner.profileImage}`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.owner?.fullName || 'O')}&background=1e3a5f&color=fff&size=24`}
                    alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs text-slate-400">{p.owner?.fullName}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!p.verified && (
                  <button onClick={() => verify(p._id)}
                    className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span> Verify
                  </button>
                )}
                <button onClick={() => toggleStatus(p._id)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${p.isActive ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-400'}`}>
                  {p.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteProperty(p._id)}
                  className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">Page {page} of {pages} · {total} properties</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-sm rounded-xl transition-colors">← Prev</button>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-sm rounded-xl transition-colors">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
