import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function RoommateListing() {
    const { roommates } = useContext(GlobalContext);
    const [filters, setFilters] = useState({
        city: 'All Cities',
        budgetStr: 'Any Budget',
        gender: 'Any Gender'
    });

    const [filteredData, setFilteredData] = useState(roommates);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        let result = roommates;

        if (filters.city !== 'All Cities') {
            result = result.filter(r => r.city === filters.city);
        }

        if (filters.gender !== 'Any Gender') {
            result = result.filter(r => r.gender === filters.gender);
        }

        if (filters.budgetStr !== 'Any Budget') {
            result = result.filter(r => {
                if (filters.budgetStr === '$500 - $1,000') return r.budget >= 500 && r.budget <= 1000;
                if (filters.budgetStr === '$1,000 - $2,000') return r.budget > 1000 && r.budget <= 2000;
                if (filters.budgetStr === '$2,000+') return r.budget > 2000;
                return true;
            });
        }

        setFilteredData(result);
    };

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 px-8 max-w-screen-2xl mx-auto">
                {/*  Editorial Header Section  */}
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-tighter mb-4 max-w-3xl leading-none">
                        Find your partner in <span className="text-primary italic">modern living</span>.
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-xl font-body leading-relaxed">
                        Connect with curated individuals who share your lifestyle, values, and vision for a sanctuary home.
                    </p>
                </header>

                {/*  Filters Section  */}
                <section className="mb-12 flex flex-col md:flex-row items-end gap-6 p-8 bg-surface-container-low rounded-xl">
                    <div className="w-full md:w-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/*  City Filter  */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-70">Preferred City</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                                <select name="city" value={filters.city} onChange={handleFilterChange} className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-on-surface focus:ring-2 focus:ring-primary appearance-none">
                                    <option>All Cities</option>
                                    <option>New York</option>
                                    <option>San Francisco</option>
                                    <option>Austin</option>
                                </select>
                            </div>
                        </div>
                        {/*  Budget Filter  */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-70">Monthly Budget</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">payments</span>
                                <select name="budgetStr" value={filters.budgetStr} onChange={handleFilterChange} className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-on-surface focus:ring-2 focus:ring-primary appearance-none">
                                    <option>Any Budget</option>
                                    <option>$500 - $1,000</option>
                                    <option>$1,000 - $2,000</option>
                                    <option>$2,000+</option>
                                </select>
                            </div>
                        </div>
                        {/*  Gender Filter  */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-70">Gender Identity</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">group</span>
                                <select name="gender" value={filters.gender} onChange={handleFilterChange} className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl text-on-surface focus:ring-2 focus:ring-primary appearance-none">
                                    <option>Any Gender</option>
                                    <option>Female</option>
                                    <option>Male</option>
                                    <option>Non-binary</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <button onClick={applyFilters} className="bg-secondary text-white px-10 py-3 rounded-full font-bold hover:brightness-110 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">tune</span>
                        Apply Filters
                    </button>
                </section>

                {/*  Roommate Grid  */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredData.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-on-surface-variant font-bold">No roommates found based on your filters.</div>
                    ) : (
                        filteredData.map((roommate) => (
                            <div key={roommate.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col">
                                <div className="relative h-72 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={roommate.image} alt={roommate.name} />
                                    {roommate.verified && (
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 text-primary">
                                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                            Verified Profile
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-on-surface">{roommate.name}</h3>
                                            <p className="text-on-surface-variant flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {roommate.location}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-primary font-black text-xl leading-none">${roommate.budget.toLocaleString()}</span>
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Max Budget</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {roommate.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                    <Link to={`/view-roommate/${roommate.id}`} className="mt-auto">
                                        <button className="w-full py-3 bg-surface-container-high text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                                            View Profile
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/*  Load More Section  */}
                <div className="mt-20 flex justify-center">
                    <button className="group flex items-center gap-3 text-lg font-bold text-on-surface-variant hover:text-primary transition-colors">
                        Discover More Potential Roommates
                        <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
                    </button>
                </div>
            </main>
            <Footer />
        </>
    );
}
