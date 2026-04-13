import React, { useEffect, useState } from 'react';
import { adminAPI } from '../adminAPI';
import toast from 'react-hot-toast';

const getImg = (img) => img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';

const TABS = ['pending', 'approved', 'rejected'];
const TAB_COLORS = { pending: 'text-yellow-400 border-yellow-400', approved: 'text-green-400 border-green-400', rejected: 'text-red-400 border-red-400' };

export default function AdminModeration() {
  const [tab, setTab] = useState('pending');
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [safetyModal, setSafetyModal] = useState(null);
  const [safetyForm, setSafetyForm] = useState({
    overallScore: 3, safeForWomen: false, metroNearby: false,
    marketNearby: false, hospitalNearby: false, wellLit: false, lowCrime: false
  });

  useEffect(() => { load(); }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getModeration({ status: tab, limit: 20 });
      setProperties(res.data.properties);
      setTotal(res.data.total);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await adminAPI.moderateProperty(id, 'approved', '');
      setProperties(prev => prev.filter(p => p._id !== id));
      setTotal(prev => prev - 1);
      toast.success('Property approved ✅');
    } catch { toast.error('Failed'); }
    finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal);
    try {
      await adminAPI.moderateProperty(rejectModal, 'rejected', rejectNote);
      setProperties(prev => prev.filter(p => p._id !== rejectModal));
      setTotal(prev => prev - 1);
      toast.success('Property rejected');
      setRejectModal(null);
      setRejectNote('');
    } catch { toast.error('Failed'); }
    finally { setActionLoading(null); }
  };

  const handleSafety = async () => {
    try {
      await adminAPI.setSafetyScore(safetyModal, safetyForm);
      toast.success('Safety score saved ✅');
      setSafetyModal(null);
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Listing Moderation</h2>
        <p className="text-slate-400 text-sm mt-1">Review and approve new property listings before they go live</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-800">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 text-sm font-bold capitalize border-b-2 transition-colors ${tab === t ? TAB_COLORS[t] : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
            {t}
          </button>
        ))}
      </div>

      <p className="text-slate-400 text-sm">{total} {tab} listings</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-slate-900 rounded-2xl animate-pulse border border-slate-800"></div>)}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-5xl text-slate-600 block mb-3">
            {tab === 'pending' ? 'pending_actions' : tab === 'approved' ? 'check_circle' : 'cancel'}
          </span>
          <p className="text-slate-400">No {tab} listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {properties.map(p => (
            <div key={p._id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img src={getImg(p.images?.[0])} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-slate-800/90 text-white text-xs font-bold px-2 py-1 rounded-full capitalize">{p.category}</span>
                </div>
                {p.images?.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-slate-800/90 text-slate-300 text-xs px-2 py-1 rounded-full">
                    +{p.images.length - 1} photos
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">{p.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>{p.address}, {p.city}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-extrabold text-sm">₹{p.price?.toLocaleString('en-IN')}/mo</span>
                  <span className="text-slate-400 text-xs">Deposit: ₹{p.deposit?.toLocaleString('en-IN') || 0}</span>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2">
                  <img src={p.owner?.profileImage
                    ? (p.owner.profileImage.startsWith('http') ? p.owner.profileImage : `http://localhost:5000${p.owner.profileImage}`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.owner?.fullName || 'O')}&background=1e3a5f&color=fff&size=24`}
                    alt="" className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{p.owner?.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{p.owner?.email}</p>
                  </div>
                </div>

                {p.description && (
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{p.description}</p>
                )}

                {p.moderationNote && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="text-red-400 text-xs"><span className="font-bold">Rejection note:</span> {p.moderationNote}</p>
                  </div>
                )}

                <p className="text-slate-600 text-xs">Submitted {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto pt-1">
                  {tab === 'approved' && (
                    <button onClick={() => { setSafetyModal(p._id); setSafetyForm(p.neighborhoodSafety || { overallScore: 3, safeForWomen: false, metroNearby: false, marketNearby: false, hospitalNearby: false, wellLit: false, lowCrime: false }); }}
                      className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-xs">shield</span> Set Safety Score
                    </button>
                  )}
                  {tab === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(p._id)} disabled={actionLoading === p._id}
                        className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                        {actionLoading === p._id
                          ? <span className="w-3 h-3 border border-green-400/30 border-t-green-400 rounded-full animate-spin"></span>
                          : <><span className="material-symbols-outlined text-xs">check_circle</span> Approve</>}
                      </button>
                      <button onClick={() => { setRejectModal(p._id); setRejectNote(''); }} disabled={actionLoading === p._id}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
                        <span className="material-symbols-outlined text-xs">cancel</span> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety Score Modal */}
      {safetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              Set Neighborhood Safety Score
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-2 block">Overall Score: {safetyForm.overallScore}/5</label>
                <input type="range" min="1" max="5" value={safetyForm.overallScore}
                  onChange={e => setSafetyForm(p => ({ ...p, overallScore: Number(e.target.value) }))}
                  className="w-full accent-green-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Unsafe</span><span>Very Safe</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'safeForWomen', label: '👩 Safe for Women' },
                  { key: 'metroNearby', label: '🚇 Metro Nearby' },
                  { key: 'marketNearby', label: '🛍️ Market Nearby' },
                  { key: 'hospitalNearby', label: '🏥 Hospital Nearby' },
                  { key: 'wellLit', label: '💡 Well Lit Streets' },
                  { key: 'lowCrime', label: '🛡️ Low Crime Area' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2.5 cursor-pointer">
                    <input type="checkbox" checked={safetyForm[key]}
                      onChange={e => setSafetyForm(p => ({ ...p, [key]: e.target.checked }))}
                      className="accent-green-500 w-4 h-4" />
                    <span className="text-slate-300 text-xs font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSafetyModal(null)} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={handleSafety} className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">Save Score</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Reject Listing</h3>
            <p className="text-slate-400 text-sm mb-4">Provide a reason so the owner knows what to fix.</p>
            <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)}
              rows={3} placeholder="e.g. Images are unclear, price seems incorrect..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-red-500 placeholder:text-slate-600 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleReject} disabled={!!actionLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
