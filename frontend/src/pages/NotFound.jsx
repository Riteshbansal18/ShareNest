import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col font-inter">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest">
                <div className="relative w-full max-w-lg mb-8">
                    {/* SVG graphic to represent an empty or lost state */}
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
                    <span className="material-symbols-outlined text-[150px] text-primary/80 drop-shadow-sm font-light relative z-10">
                        house_siding
                    </span>
                    <div className="absolute top-10 right-20 w-8 h-8 rounded-full bg-secondary-container animate-bounce"></div>
                    <div className="absolute bottom-10 left-20 w-4 h-4 rounded-full bg-tertiary-container animate-ping"></div>
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-on-surface tracking-tighter mb-4">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-6">
                    Looks like this room is empty.
                </h2>
                <p className="text-on-surface-variant max-w-md mx-auto mb-10 text-lg leading-relaxed">
                    We searched high and low, but the page you're trying to find has either moved, been rented, or doesn't exist.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/" className="w-full sm:w-auto">
                        <button className="w-full bg-primary text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                            Return Home
                        </button>
                    </Link>
                    <Link to="/find-homes" className="w-full sm:w-auto">
                        <button className="w-full bg-surface-container-high text-primary px-8 py-3.5 rounded-full font-bold hover:bg-surface-container-highest transition-all">
                            Browse Listings
                        </button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
