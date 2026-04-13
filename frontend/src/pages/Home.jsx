import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GlobalContext } from '../context/GlobalContext';
import { getRecentlyViewed } from '../hooks/useRecentlyViewed';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];

const CITY_IMAGES = {
  Mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80',
  Delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80',
  Bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80',
  Hyderabad: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  Pune: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  Chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80',
};

const STATS = [
  { value: '10,000+', label: 'Verified Listings', icon: 'home_work' },
  { value: '50,000+', label: 'Happy Tenants', icon: 'people' },
  { value: '6', label: 'Major Cities', icon: 'location_city' },
  { value: '4.8★', label: 'Average Rating', icon: 'star' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: 'search', title: 'Search & Filter', desc: 'Browse thousands of verified PGs, hostels and rooms across India. Filter by city, budget, gender preference and amenities.' },
  { step: '02', icon: 'visibility', title: 'View & Compare', desc: 'See detailed photos, amenities, owner info and real reviews. Compare multiple properties side by side.' },
  { step: '03', icon: 'hotel', title: 'Book Instantly', desc: 'Send a booking request directly to the owner. No middlemen, no brokerage. Move in on your schedule.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Bangalore', text: 'Found my perfect PG in Koramangala within 2 days! The verified listings gave me confidence and the booking process was super smooth.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', rating: 5 },
  { name: 'Rahul Mehta', city: 'Mumbai', text: 'ShareNest saved me from paying brokerage. Got a great room in Andheri with all amenities at a fair price. Highly recommend!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 5 },
  { name: 'Sneha Reddy', city: 'Hyderabad', text: 'As a working woman, safety was my top priority. The verified listings and detailed owner profiles made me feel secure in my choice.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', rating: 5 },
];

export default function Home() {
  const { properties, roommates, propertiesLoading } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchType, setSearchType] = useState('pg');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    setRecentlyViewed(getRecentlyViewed());
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (searchBudget) params.set('maxPrice', searchBudget);
    navigate(`/find-homes?${params.toString()}`);
  };

  const getImg = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const featuredProperties = properties.filter(p => p.verified).slice(0, 6);
  const recentProperties = properties.slice(0, 3);

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-950">
          {/* Background */}
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80"
              alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40"></div>
          </div>

          {/* Floating cards */}
          <div className="absolute right-8 top-1/4 hidden xl:block animate-float">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 w-56">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">verified</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">Just Verified</p>
                  <p className="text-white/60 text-xs">Koramangala, Bangalore</p>
                </div>
              </div>
              <p className="text-emerald-400 font-extrabold text-lg">₹12,000/mo</p>
            </div>
          </div>
          <div className="absolute right-64 top-1/2 hidden xl:block">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 w-52">
              <p className="text-white/60 text-xs mb-1">New Booking</p>
              <p className="text-white font-bold text-sm">Andheri West PG</p>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-blue-300 text-sm font-semibold">10,000+ verified listings across India</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                Find Your Perfect<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">PG & Room</span><br />
                in India
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                Verified PGs, hostels and shared rooms across Mumbai, Delhi, Bangalore and more. Zero brokerage. Book directly with owners.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl shadow-2xl">                <div className="flex-1 flex items-center gap-2 px-3">
                  <span className="material-symbols-outlined text-slate-400 text-xl">location_on</span>
                  <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-semibold text-sm py-2">
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex-1 flex items-center gap-2 px-3">
                  <span className="material-symbols-outlined text-slate-400 text-xl">currency_rupee</span>
                  <select value={searchBudget} onChange={e => setSearchBudget(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-semibold text-sm py-2">
                    <option value="">Any Budget</option>
                    <option value="8000">Under ₹8,000</option>
                    <option value="12000">Under ₹12,000</option>
                    <option value="20000">Under ₹20,000</option>
                    <option value="35000">Under ₹35,000</option>
                    <option value="50000">Under ₹50,000</option>
                  </select>
                </div>
                <div className="w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex-1 flex items-center gap-2 px-3">
                  <span className="material-symbols-outlined text-slate-400 text-xl">home</span>
                  <select value={searchType} onChange={e => setSearchType(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 font-semibold text-sm py-2">
                    <option value="pg">PG / Hostel</option>
                    <option value="flat">Whole Flat</option>
                    <option value="private-room">Private Room</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                <button type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap">
                  <span className="material-symbols-outlined text-sm">search</span> Search
                </button>
              </form>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2 mt-5">
                {['Girls PG', 'Near Metro', 'Fully Furnished', 'No Brokerage', 'AC Rooms', 'With Meals'].map(tag => (
                  <Link key={tag} to="/find-homes"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="bg-blue-600 py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="text-center">
                <span className="material-symbols-outlined text-blue-200 text-2xl mb-2 block">{icon}</span>
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-blue-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BROWSE BY CITY ── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Explore</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Browse by City</h2>
              <p className="text-slate-500 mt-3">Find PGs and rooms in India's top cities</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CITIES.map(city => {
                const count = properties.filter(p => p.city === city).length;
                return (
                  <Link key={city} to={`/find-homes?city=${city}`}
                    className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer">
                    <img src={CITY_IMAGES[city]} alt={city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-extrabold text-lg leading-tight">{city}</p>
                      <p className="text-white/70 text-xs">{count} listings</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURED LISTINGS ── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Top Picks</span>
                <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Verified Listings</h2>
                <p className="text-slate-500 mt-2">Handpicked, verified properties across India</p>
              </div>
              <Link to="/find-homes" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                View all <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredProperties.length > 0 ? featuredProperties : recentProperties).map(p => (
                  <Link key={p._id} to={`/property-details/${p._id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
                    <div className="relative h-52 overflow-hidden">
                      <img src={getImg(p.images?.[0])} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.verified && (
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full capitalize">
                        {p.category?.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{p.title}</h3>
                      <p className="text-slate-500 text-xs flex items-center gap-1 mb-3">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {p.neighborhood ? `${p.neighborhood}, ` : ''}{p.city}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-extrabold text-xl">
                          ₹{p.price?.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
                        </span>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span className="bg-slate-100 px-2 py-1 rounded-full">{p.roomType}</span>
                          {p.genderPref !== 'Any' && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{p.genderPref}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link to="/find-homes"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg shadow-blue-600/20">
                Browse All Listings <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Simple Process</span>
              <h2 className="text-4xl font-extrabold text-white mt-2">How ShareNest Works</h2>
              <p className="text-slate-400 mt-3">Find and book your perfect room in 3 easy steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                <div key={step} className="relative">
                  <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 h-full">
                    <div className="text-6xl font-extrabold text-slate-800 mb-4">{step}</div>
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
                      <span className="material-symbols-outlined text-white">{icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
                  </div>
                  {step !== '03' && (
                    <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                      <span className="material-symbols-outlined text-slate-700 text-3xl">arrow_forward</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FIND ROOMMATES CTA ── */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-blue-200 font-bold text-xs uppercase tracking-widest">Roommate Matching</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-3 leading-tight">
                  Find a compatible<br />roommate too
                </h2>
                <p className="text-blue-100 mt-5 text-lg leading-relaxed">
                  Browse {roommates.length}+ roommate profiles. Filter by city, budget, lifestyle and gender preference. Connect directly — no middlemen.
                </p>
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link to="/roommate-listing"
                    className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full hover:shadow-xl transition-all">
                    Find Roommates
                  </Link>
                  <Link to="/create-post"
                    className="bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/20 transition-all">
                    List Your Property
                  </Link>
                </div>
              </div>
              {/* Roommate preview cards */}
              <div className="grid grid-cols-2 gap-4">
                {roommates.slice(0, 4).map((r, i) => {
                  const name = r.user?.fullName || 'User';
                  const img = r.user?.profileImage;
                  const avatar = img ? (img.startsWith('http') ? img : `http://localhost:5000${img}`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a5f&color=fff&size=80`;
                  return (
                    <div key={r._id || i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mb-3" />
                      <p className="text-white font-bold text-sm">{name.split(' ')[0]}</p>
                      <p className="text-blue-200 text-xs">{r.preferredCities?.[0] || r.user?.location}</p>
                      <p className="text-white font-bold text-sm mt-2">₹{r.budget?.toLocaleString('en-IN')}/mo</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(r.tags || []).slice(0, 2).map(tag => (
                          <span key={tag} className="bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Reviews</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2">What our users say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map(({ name, city, text, avatar, rating }) => (
                <div key={name} className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(rating)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{name}</p>
                      <p className="text-slate-400 text-xs">{city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECENTLY VIEWED ── */}
        {recentlyViewed.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Your History</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Recently Viewed</h2>
                </div>
                <button onClick={() => { localStorage.removeItem('sharenest_recently_viewed'); setRecentlyViewed([]); }}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  Clear history
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recentlyViewed.map(p => (
                  <Link key={p._id} to={`/property-details/${p._id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 hover:-translate-y-1 duration-200">
                    <div className="relative h-28 overflow-hidden">
                      <img src={p.images?.[0]
                        ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`)
                        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'}
                        alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.verified && (
                        <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">✓</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-slate-800 text-xs line-clamp-1">{p.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{p.city}</p>
                      <p className="text-blue-600 font-extrabold text-sm mt-1">₹{p.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL CTA ── */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Ready to find your<br />perfect room?
            </h2>
            <p className="text-slate-500 mt-5 text-lg">Join 50,000+ tenants who found their home on ShareNest</p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link to="/find-homes"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                <span className="material-symbols-outlined">search</span> Find Rooms Now
              </Link>
              <Link to="/sign-up"
                className="border-2 border-slate-200 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-bold px-10 py-4 rounded-full transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">person_add</span> Create Free Account
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
