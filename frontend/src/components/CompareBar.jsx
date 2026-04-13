import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (property) => {
    setCompareList(prev => {
      if (prev.find(p => p._id === property._id)) return prev.filter(p => p._id !== property._id);
      if (prev.length >= 3) { alert('Max 3 properties can be compared'); return prev; }
      return [...prev, property];
    });
  };

  const isInCompare = (id) => compareList.some(p => p._id === id);
  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

const AMENITY_LIST = ['WiFi', 'Air Conditioning', 'Parking', 'Laundry', 'Gym', 'Furnished', 'Kitchen', 'Security', 'Balcony'];

export function CompareModal({ onClose }) {
  const { compareList } = useContext(CompareContext);
  const getImg = (img) => img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Compare Properties</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <td className="w-32 pr-4 font-bold text-slate-400 text-xs uppercase tracking-widest pb-4">Feature</td>
                {compareList.map(p => (
                  <td key={p._id} className="pb-4 px-3 text-center">
                    <img src={getImg(p.images?.[0])} alt={p.title} className="w-full h-32 object-cover rounded-xl mb-2" />
                    <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{p.title}</p>
                    <p className="text-slate-500 text-xs mt-1">{p.city}</p>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { label: 'Price', render: p => <span className="font-extrabold text-blue-600">₹{p.price?.toLocaleString('en-IN')}/mo</span> },
                { label: 'Deposit', render: p => `₹${p.deposit?.toLocaleString('en-IN') || 0}` },
                { label: 'Type', render: p => p.category?.replace('-', ' ') },
                { label: 'Room', render: p => p.roomType },
                { label: 'Bedrooms', render: p => p.bedroomCount },
                { label: 'Bathrooms', render: p => p.bathroomCount },
                { label: 'Gender Pref', render: p => p.genderPref || 'Any' },
                { label: 'Verified', render: p => p.verified ? '✅ Yes' : '❌ No' },
                { label: 'Rating', render: p => p.reviewCount > 0 ? `⭐ ${p.averageRating} (${p.reviewCount})` : 'No reviews' },
                ...AMENITY_LIST.map(a => ({
                  label: a,
                  render: p => p.amenities?.includes(a) ? '✅' : '❌'
                }))
              ].map(({ label, render }) => (
                <tr key={label}>
                  <td className="py-3 pr-4 font-semibold text-slate-500 text-xs">{label}</td>
                  {compareList.map(p => (
                    <td key={p._id} className="py-3 px-3 text-center text-slate-700 dark:text-slate-300 text-sm">{render(p)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CompareBar() {
  const { compareList, clearCompare, isInCompare } = useContext(CompareContext);
  const [showModal, setShowModal] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white px-4 py-3 flex items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          <span className="text-sm font-bold text-slate-300 whitespace-nowrap">Compare ({compareList.length}/3):</span>
          {compareList.map(p => (
            <span key={p._id} className="bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
              {p.title?.substring(0, 20)}...
            </span>
          ))}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => setShowModal(true)} disabled={compareList.length < 2}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-full text-sm transition-colors">
            Compare
          </button>
          <button onClick={clearCompare} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-full text-sm transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
      {showModal && <CompareModal onClose={() => setShowModal(false)} />}
    </>
  );
}
