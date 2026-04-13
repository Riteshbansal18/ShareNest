import React, { useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function RoommateListing() {
  const { roommates, roommatesLoading, toggleFavoriteRoommate, favoriteRoommates } = useContext(GlobalContext);
  const [filters, setFilters] = useState({ city: 'All Cities', budgetStr: 'Any Budget', gender: 'Any Gender' });
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    let result = [...roommates];
    if (filters.city !== 'All Cities') {
      result = result.filter(r => {
        const cities = r.preferredCities || (r.city ? [r.city] : []);
        return cities.some(c => c.toLowerCase().includes(filters.city.toLowerCase()));
      });
    }
    if (filters.gender !== 'Any Gender') result = result.filter(r => r.gender === filters.gender || r.user?.gender === filters.gender);
    if (filters.budgetStr !== 'Any Budget') {
      result = result.filter(r => {
        const b = r.budget;
        if (filters.budgetStr === 'Under ₹8,000') return b < 8000;
        if (filters.budgetStr === '₹8,000 - ₹15,000') return b >= 8000 && b <= 15000;
        if (filters.budgetStr === '₹15,000+') return b > 15000;
        return true;
      });
    }
    if (searchQuery) {
      result = result.filter(r => {
        const name = r.user?.fullName || r.name || '';
        const loc = r.user?.location || r.location || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    setFilteredData(result);
  }, [roommates, filters, searchQuery]);

  const getAvatarUrl = (r) => {
    const img = r.user?.profileImage || r.image;
    if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.fullName || r.name || 'U')}&background=1e3a5f&color=fff&size=200`;
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const getName = (r) => r.user?.fullName || r.name || 'Unknown';
  const getLocation = (r) => r.user?.location || r.location || (r.preferredCities?.[0]) || 'Location not set';
  const getTags = (r) => r.tags || r.user?.interests || [];
  const getId = (r) => r._id || r.id;
  const isVerified = (r) => r.verified || r.user?.verificationLevel > 0;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">Find Roommates</h1>
          <p className="text-on-surface-variant mt-2">Connect with compatible people looking for a place to share.</p>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest rounded-xl p-4 md:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Search</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface"
                placeholder="Search by name or location..." />
            </div>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">City</label>
            <select name="city" value={filters.city} onChange={handleFilterChange}
              className="w-full px-3 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface">
              <option>All Cities</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Chennai</option>
            </select>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Budget</label>
            <select name="budgetStr" value={filters.budgetStr} onChange={handleFilterChange}
              className="w-full px-3 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface">
              <option>Any Budget</option>
              <option>Under ₹8,000</option>
              <option>₹8,000 - ₹15,000</option>
              <option>₹15,000+</option>
            </select>
          </div>
          <div className="flex-1 min-w-36">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Gender</label>
            <select name="gender" value={filters.gender} onChange={handleFilterChange}
              className="w-full px-3 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface">
              <option>Any Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
            </select>
          </div>
        </div>

        <p className="text-on-surface-variant text-sm mb-6">
          {roommatesLoading ? 'Loading...' : <><span className="font-bold text-on-surface">{filteredData.length}</span> roommates found</>}
        </p>

        {roommatesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden animate-pulse">
                <div className="h-56 bg-surface-container-high"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
                  <div className="h-3 bg-surface-container-high rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant">person_search</span>
            <p className="text-on-surface-variant mt-4 text-lg font-medium">No roommates match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(roommate => (
              <div key={getId(roommate)} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                <div className="relative h-56 overflow-hidden">
                  <img src={getAvatarUrl(roommate)} alt={getName(roommate)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button onClick={() => toggleFavoriteRoommate(getId(roommate))}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: favoriteRoommates.includes(getId(roommate)) ? "'FILL' 1" : "'FILL' 0", color: favoriteRoommates.includes(getId(roommate)) ? '#ef4444' : '#64748b' }}>
                      favorite
                    </span>
                  </button>
                  {isVerified(roommate) && (
                    <span className="absolute top-3 left-3 bg-on-tertiary-container text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-on-surface text-base">{getName(roommate)}</h3>
                  <p className="text-on-surface-variant text-xs mt-1 flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-xs">location_on</span>{getLocation(roommate)}
                  </p>
                  <p className="text-primary font-bold text-sm mb-3">Budget: ₹{roommate.budget?.toLocaleString('en-IN')}/mo</p>
                  {roommate.compatibilityScore !== null && roommate.compatibilityScore !== undefined && (
                    <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${roommate.compatibilityScore >= 70 ? 'bg-green-50 text-green-600' : roommate.compatibilityScore >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      {roommate.compatibilityScore}% match
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {getTags(roommate).slice(0, 3).map((tag, i) => (
                      <span key={i} className="bg-surface-container text-on-surface-variant text-xs px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <Link to={`/view-roommate/${getId(roommate)}`}
                    className="block w-full text-center py-2.5 bg-primary/10 text-primary font-bold rounded-full text-sm hover:bg-primary hover:text-white transition-all">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
