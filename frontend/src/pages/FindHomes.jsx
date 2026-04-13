import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useSearchParams } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { CompareContext } from '../components/CompareBar';

const PropertyMap = lazy(() => import('../components/PropertyMap'));

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
const AMENITIES_LIST = ['WiFi', 'Air Conditioning', 'Parking', 'Laundry', 'Gym', 'Pet Friendly', 'Furnished', 'Kitchen', 'Security'];

export default function FindHomes() {
  const { properties, propertiesLoading, toggleFavoriteProperty, favoriteProperties } = useContext(GlobalContext);
  const { toggleCompare, isInCompare } = useContext(CompareContext);
  const [searchParams] = useSearchParams();
  const [budget, setBudget] = useState(50000);
  const [selectedCities, setSelectedCities] = useState([]);
  const [gender, setGender] = useState('Any');
  const [roomType, setRoomType] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Read URL params from Home search on first load
  useEffect(() => {
    const city = searchParams.get('city');
    const maxPrice = searchParams.get('maxPrice');
    if (city) setSelectedCities([city]);
    if (maxPrice) setBudget(Number(maxPrice));
  }, []);

  const toggleCity = (c) => setSelectedCities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleAmenity = (a) => setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const clearAll = () => {
    setBudget(50000); setSelectedCities([]); setGender('Any');
    setRoomType(''); setAmenities([]); setSortOption('newest'); setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    let result = [...properties].filter(item => item.price <= budget);
    if (selectedCities.length > 0) result = result.filter(item => selectedCities.includes(item.city));
    if (gender !== 'Any') result = result.filter(item => item.genderPref === gender || item.genderPref === 'Any');
    if (roomType) result = result.filter(item => item.roomType === roomType);
    if (amenities.length > 0) result = result.filter(item => amenities.every(a => item.amenities?.includes(a)));
    if (searchQuery) result = result.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredData(result);
    setCurrentPage(1);
  }, [properties, budget, selectedCities, gender, roomType, amenities, sortOption, searchQuery]);

  const getImageUrl = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const formatINR = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Find PGs & Rooms</h1>
            <p className="text-on-surface-variant mt-1 text-sm">Verified listings across top Indian cities</p>
          </div>
          {/* Mobile filter button */}
          <button onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold">
            <span className="material-symbols-outlined text-sm">tune</span> Filters
            {(selectedCities.length > 0 || amenities.length > 0 || gender !== 'Any' || roomType) && (
              <span className="bg-white text-primary text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                {selectedCities.length + amenities.length + (gender !== 'Any' ? 1 : 0) + (roomType ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-surface flex items-center justify-between p-4 border-b border-outline-variant/20">
                <h2 className="text-lg font-bold text-on-surface">Filters</h2>
                <div className="flex gap-3">
                  <button onClick={clearAll} className="text-sm text-primary font-semibold">Clear All</button>
                  <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-full bg-surface-container">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
              <div className="p-5 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Search</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-surface-container-highest rounded-xl border-none text-sm text-on-surface"
                      placeholder="City, area, title..." />
                  </div>
                </div>
                {/* Budget */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Max Budget</label>
                  <div className="text-2xl font-extrabold text-primary mb-3">{formatINR(budget)}<span className="text-sm font-normal text-on-surface-variant">/mo</span></div>
                  <input type="range" min="3000" max="50000" step="500" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-primary h-2 rounded-full" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[8000, 12000, 20000, 35000].map(v => (
                      <button key={v} onClick={() => setBudget(v)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${budget === v ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>₹{(v/1000).toFixed(0)}K</button>
                    ))}
                  </div>
                </div>
                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">City</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CITIES.map(city => (
                      <button key={city} onClick={() => toggleCity(city)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold text-left transition-all ${selectedCities.includes(city) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">For</label>
                  <div className="flex gap-2">
                    {['Any', 'Male', 'Female'].map(g => (
                      <button key={g} onClick={() => setGender(g)} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${gender === g ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>{g}</button>
                    ))}
                  </div>
                </div>
                {/* Room Type */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Room Type</label>
                  <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full px-3 py-3 bg-surface-container-highest rounded-xl border-none text-sm text-on-surface">
                    <option value="">All Types</option>
                    <option>Single Room</option><option>Shared Space</option><option>Entire Flat</option><option>Studio</option>
                  </select>
                </div>
                {/* Amenities */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES_LIST.map(a => (
                      <button key={a} onClick={() => toggleAmenity(a)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold text-left transition-all ${amenities.includes(a) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowFilters(false)} className="w-full py-4 bg-primary text-white font-bold rounded-full">
                  Show {filteredData.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Filters Sidebar — desktop only ── */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-7 sticky top-24">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-on-surface">Filters</h2>
                <button onClick={clearAll} className="text-xs text-primary font-semibold hover:underline">Clear All</button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Search</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface"
                    placeholder="City, area, title..." />
                </div>
              </div>

              {/* Budget — Indian Rupees */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Max Budget
                </label>
                <div className="text-2xl font-extrabold text-primary mb-3">{formatINR(budget)}<span className="text-sm font-normal text-on-surface-variant">/mo</span></div>
                <input type="range" min="3000" max="50000" step="500" value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full" />
                <div className="flex justify-between text-xs text-outline mt-2">
                  <span>₹3,000</span>
                  <span>₹50,000</span>
                </div>
                {/* Quick select buttons */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {[8000, 12000, 20000, 35000].map(v => (
                    <button key={v} onClick={() => setBudget(v)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${budget === v ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      ₹{(v / 1000).toFixed(0)}K
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">City</label>
                <div className="space-y-2">
                  {CITIES.map(city => (
                    <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={selectedCities.includes(city)} onChange={() => toggleCity(city)}
                        className="w-4 h-4 accent-primary rounded" />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">For</label>
                <div className="flex gap-2">
                  {['Any', 'Male', 'Female'].map(g => (
                    <button key={g} onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${gender === g ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Room Type</label>
                <select value={roomType} onChange={e => setRoomType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface">
                  <option value="">All Types</option>
                  <option>Single Room</option>
                  <option>Shared Space</option>
                  <option>Entire Flat</option>
                  <option>Studio</option>
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Amenities</label>
                <div className="space-y-2">
                  {AMENITIES_LIST.map(a => (
                    <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)}
                        className="w-4 h-4 accent-primary rounded" />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Listings ── */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-on-surface-variant text-sm">
                {propertiesLoading ? 'Loading...' : (
                  <><span className="font-bold text-on-surface">{filteredData.length}</span> listings found</>
                )}
              </p>
              <div className="flex items-center gap-3">
                {/* View toggle */}
                <div className="flex bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
                  <button onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 flex items-center gap-1.5 text-xs font-bold transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-sm">grid_view</span> Grid
                  </button>
                  <button onClick={() => setViewMode('map')}
                    className={`px-3 py-2 flex items-center gap-1.5 text-xs font-bold transition-colors ${viewMode === 'map' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'}`}>
                    <span className="material-symbols-outlined text-sm">map</span> Map
                  </button>
                </div>
                <select value={sortOption} onChange={e => setSortOption(e.target.value)}
                  className="px-4 py-2 bg-surface-container-lowest rounded-xl border border-outline-variant/20 text-sm text-on-surface focus:ring-2 focus:ring-primary/20">
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="h-[600px] rounded-2xl overflow-hidden shadow-sm mb-6">
                <Suspense fallback={<div className="h-full bg-surface-container-highest rounded-2xl animate-pulse flex items-center justify-center"><span className="text-on-surface-variant">Loading map...</span></div>}>
                  <PropertyMap properties={filteredData} selectedCity={selectedCities[0]} />
                </Suspense>
              </div>
            )}

            {viewMode === 'grid' && propertiesLoading ? (              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-52 bg-surface-container-high"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-surface-container-high rounded w-3/4"></div>
                      <div className="h-3 bg-surface-container-high rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-24 bg-surface-container-lowest rounded-2xl">
                <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
                <p className="text-on-surface-variant mt-4 text-lg font-medium">No listings match your filters</p>
                <p className="text-on-surface-variant text-sm mt-1">Try increasing the budget or clearing filters</p>
                <button onClick={clearAll} className="mt-5 px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(property => {
                  const isFav = favoriteProperties.includes(property._id);
                  return (
                    <div key={property._id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm group hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                      <div className="relative h-52 overflow-hidden">
                        <img src={getImageUrl(property.images?.[0])} alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button onClick={() => toggleFavoriteProperty(property._id)}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0", color: isFav ? '#ef4444' : '#64748b' }}>
                            favorite
                          </span>
                        </button>
                        {property.verified && (
                          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                          </span>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <span className="text-white text-xs font-bold capitalize bg-black/30 px-2 py-0.5 rounded-full">
                            {property.category?.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1.5">
                          <h3 className="font-bold text-on-surface text-sm leading-tight line-clamp-2 flex-1 mr-2">{property.title}</h3>
                          <span className="text-primary font-extrabold text-base whitespace-nowrap">
                            {formatINR(property.price)}<span className="text-xs font-normal text-on-surface-variant">/mo</span>
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-xs mb-3 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="bg-surface-container text-on-surface-variant text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">bed</span>{property.bedroomCount || 1} Bed
                          </span>
                          <span className="bg-surface-container text-on-surface-variant text-xs px-2 py-0.5 rounded-full">{property.roomType}</span>
                          {property.genderPref && property.genderPref !== 'Any' && (
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">{property.genderPref}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                          <div className="flex items-center gap-2">
                            <img src={property.owner?.profileImage
                              ? (property.owner.profileImage.startsWith('http') ? property.owner.profileImage : `http://localhost:5000${property.owner.profileImage}`)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(property.owner?.fullName || 'U')}&size=32&background=1e3a5f&color=fff`}
                              alt="" className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs text-on-surface-variant truncate max-w-[80px]">{property.owner?.fullName}</span>
                          </div>
                          <Link to={`/property-details/${property._id}`}
                            className="text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                            View →
                          </Link>
                          <button onClick={() => toggleCompare(property)}
                            title="Add to compare"
                            className={`p-1.5 rounded-full border transition-all ${isInCompare(property._id) ? 'bg-blue-600 border-blue-600 text-white' : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'}`}>
                            <span className="material-symbols-outlined text-sm">compare_arrows</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {filteredData.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between mt-8">
                  <p className="text-on-surface-variant text-sm">
                    Showing <span className="font-bold text-on-surface">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-bold text-on-surface">{filteredData.length}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface disabled:opacity-40 hover:bg-surface-container transition-colors">
                      ← Prev
                    </button>
                    {/* Page numbers */}
                    {Array.from({ length: Math.ceil(filteredData.length / ITEMS_PER_PAGE) }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === Math.ceil(filteredData.length / ITEMS_PER_PAGE) || Math.abs(p - currentPage) <= 1)
                      .map((p, i, arr) => (
                        <React.Fragment key={p}>
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="text-on-surface-variant">...</span>}
                          <button onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${currentPage === p ? 'bg-primary text-white' : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface hover:bg-surface-container'}`}>
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                    <button onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
                      className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface disabled:opacity-40 hover:bg-surface-container transition-colors">
                      Next →
                    </button>
                  </div>
                </div>
              )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
