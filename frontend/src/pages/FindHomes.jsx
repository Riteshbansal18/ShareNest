import React, { useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function FindHomes() {
  const { properties, toggleFavoriteProperty, favoriteProperties } = useContext(GlobalContext);
  const [budget, setBudget] = useState(5000);
  const [locations, setLocations] = useState([]);
  const [gender, setGender] = useState('Any');
  const [roomType, setRoomType] = useState('Single Room');
  const [amenities, setAmenities] = useState([]);
  const [sortOption, setSortOption] = useState('Newest First');
  const [filteredData, setFilteredData] = useState(properties);

  const toggleLocation = (loc) => {
    setLocations(prev => prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]);
  };

  const toggleAmenity = (amenity) => {
    setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const clearAll = () => {
    setBudget(5000);
    setLocations([]);
    setGender('Any');
    setRoomType('Single Room');
    setAmenities([]);
    setSortOption('Newest First');
  };

  // Effect to apply filters reactively
  useEffect(() => {
    let result = properties.filter(item => item.price <= budget);

    if (locations.length > 0) {
      result = result.filter(item => locations.includes(item.neighborhood));
    }

    if (gender !== 'Any') {
      result = result.filter(item => item.genderPref === gender);
    }

    if (roomType) {
      result = result.filter(item => item.roomType === roomType);
    }

    if (amenities.length > 0) {
      result = result.filter(item => amenities.every(a => item.amenities.includes(a)));
    }

    // Sort
    if (sortOption === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredData(result);
  }, [budget, locations, gender, roomType, amenities, sortOption, properties]);

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-screen-2xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">

          {/*  Sidebar Filters  */}
          <aside className="w-full md:w-80 space-y-8 sticky top-28 self-start h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-primary">Filters</h2>
              <button onClick={clearAll} className="text-sm font-medium text-secondary hover:underline transition-opacity">Clear All</button>
            </div>

            {/*  Budget Slider  */}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Budget Range</label>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <input
                  type="range"
                  min="500" max="5000" step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-3 text-xs font-bold text-primary">
                  <span>$500</span>
                  <span>Up to ${budget}</span>
                </div>
              </div>
            </section>

            {/*  Location Checklist  */}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Preferred Neighborhoods</label>
              <div className="space-y-3">
                {['Brooklyn Heights', 'Manhattan Downtown', 'Williamsburg'].map(loc => (
                  <label key={loc} className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
                      checked={locations.includes(loc)}
                      onChange={() => toggleLocation(loc)}
                    />
                    <span className="ml-3 text-body-md group-hover:text-primary transition-colors">{loc}</span>
                  </label>
                ))}
              </div>
            </section>

            {/*  Gender Preference  */}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Gender Preference</label>
              <div className="flex flex-wrap gap-2">
                {['Any', 'Female', 'Male'].map(g => (
                  <button key={g} onClick={() => setGender(g)} className={`px-4 py-2 rounded-full font-semibold text-sm border-2 transition-all ${gender === g ? 'bg-secondary-fixed text-on-secondary-fixed border-transparent' : 'bg-surface-container-high text-on-surface-variant border-transparent hover:border-outline-variant'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </section>

            {/*  Room Type  */}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Room Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Single Room', 'Shared Space'].map(rt => (
                  <label key={rt} className={`relative flex items-center justify-center px-4 py-3 bg-surface-container-low rounded-lg cursor-pointer border-2 transition-all ${roomType === rt ? 'border-primary bg-primary-fixed' : 'border-transparent hover:border-primary-fixed'}`}>
                    <input type="radio" name="room_type" className="sr-only" checked={roomType === rt} onChange={() => setRoomType(rt)} />
                    <span className="text-sm font-semibold">{rt}</span>
                  </label>
                ))}
              </div>
            </section>

            {/*  Amenities Checklist  */}
            <section className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Essentials</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: 'Gigabit WiFi', icon: 'wifi' },
                  { name: 'Air Conditioning', icon: 'ac_unit' },
                  { name: 'Food Services', icon: 'restaurant' },
                ].map(amenity => (
                  <label key={amenity.name} className="flex items-center p-3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 cursor-pointer hover:bg-white transition-all">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{amenity.icon}</span>
                    <span className="ml-3 flex-grow text-sm font-medium">{amenity.name}</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded-full"
                      checked={amenities.includes(amenity.name)}
                      onChange={() => toggleAmenity(amenity.name)}
                    />
                  </label>
                ))}
              </div>
            </section>
          </aside>

          {/*  Main Content Area  */}
          <div className="flex-grow space-y-8">
            {/*  Toolbar Area  */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-primary tracking-tight">Available Sanctuaries</h1>
                <p className="text-on-surface-variant text-sm mt-1">Found {filteredData.length} matches in New York</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none bg-surface-container-low border-none text-sm font-semibold py-2.5 pl-4 pr-10 rounded-full focus:ring-2 focus:ring-primary-fixed cursor-pointer">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option value="Newest First">Newest First</option>
                    <option>Best Match</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">unfold_more</span>
                </div>
              </div>
            </div>

            {/*  Bento Grid of Cards  */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {filteredData.length === 0 ? (
                <div className="col-span-1 xl:col-span-2 text-center py-12 text-on-surface-variant font-bold">No matching properties found. Try adjusting your filters.</div>
              ) : (
                filteredData.map(property => (
                  <div key={property.id} className="group bg-surface-container-lowest rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row h-full">
                    <div className="relative w-full sm:w-2/5 min-h-[240px]">
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={property.image} alt={property.title} />

                      {property.verified && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center shadow-sm">
                          <span className="material-symbols-outlined text-on-tertiary-container text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                          <span className="text-[10px] font-bold text-primary tracking-tighter uppercase">Verified Roomie</span>
                        </div>
                      )}

                      {property.justListed && (
                        <div className="absolute top-4 left-4 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Just Listed</div>
                      )}

                      {!property.verified && !property.justListed && (
                        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg">
                          <button onClick={() => toggleFavoriteProperty(property.id)} className={`transition-colors ${favoriteProperties.includes(property.id) ? 'text-error' : 'text-outline-variant'}`}>
                            <span className="material-symbols-outlined text-sm flex" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-secondary font-bold text-xs tracking-widest uppercase">{property.neighborhood}</span>
                          <span className="text-xl font-black text-primary">${property.price}<span className="text-xs font-medium text-on-surface-variant">/mo</span></span>
                        </div>
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{property.title}</h3>
                        <div className="flex items-center space-x-3 text-xs text-on-surface-variant font-medium pt-2">
                          <span className="flex items-center"><span className="material-symbols-outlined text-sm mr-1">group</span> {property.roommates} Roommate{property.roommates > 1 ? 's' : ''}</span>
                          <span className="flex items-center"><span className="material-symbols-outlined text-sm mr-1">apartment</span> {property.roomType}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-surface-container-high pt-4">
                        <div className="flex items-center space-x-2">
                          <img className="w-8 h-8 rounded-full border-2 border-white shadow-sm" src={property.userImage} alt={property.userName} />
                          <span className="text-xs font-semibold">{property.userName}</span>
                        </div>
                        <Link to={`/property-details/${property.id}`}>
                          <button className="p-2.5 bg-primary-container text-white rounded-full hover:scale-110 active:scale-95 transition-all outline-none">
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/*  Pagination  */}
            {filteredData.length > 0 && (
              <nav className="flex items-center justify-center pt-12">
                <div className="flex items-center space-x-2 bg-surface-container-low p-2 rounded-full">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">3</button>
                  <span className="text-on-surface-variant px-2 font-bold">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">12</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
