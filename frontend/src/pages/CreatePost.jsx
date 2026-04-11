import React, { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'pg',
    title: '',
    description: '',
    rent: '',
    deposit: '',
    address: '',
    amenities: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const newAmenities = checked
          ? [...prev.amenities, name]
          : prev.amenities.filter(a => a !== name);
        return { ...prev, amenities: newAmenities };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (val) => {
    setFormData(prev => ({ ...prev, category: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.rent || !formData.address) {
      alert("Please fill in the required fields (Title, Rent, Address).");
      return;
    }
    // Simulate API call
    alert("Listing submitted successfully!");
    navigate('/find-homes');
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        {/*  Hero Header  */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">Create Your Listing</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body">Share your space with the right people. Provide accurate details to find your perfect roommate or tenant faster.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/*  Sidebar Navigation/Status  */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32">
            <div className="space-y-8">
              <div className="flex items-center gap-4 step-active">
                <span className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center text-sm">1</span>
                <span className="font-headline tracking-tight">Basic Info</span>
              </div>
              <div className="flex items-center gap-4 step-inactive">
                <span className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-sm">2</span>
                <span className="font-headline tracking-tight">Property Details</span>
              </div>
              <div className="flex items-center gap-4 step-inactive">
                <span className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-sm">3</span>
                <span className="font-headline tracking-tight">Amenities</span>
              </div>
              <div className="flex items-center gap-4 step-inactive">
                <span className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-sm">4</span>
                <span className="font-headline tracking-tight">Photos</span>
              </div>
            </div>
            <div className="mt-12 p-6 bg-secondary-container rounded-xl">
              <p className="text-on-secondary-container text-sm leading-relaxed">
                <span className="font-bold block mb-1">Pro Tip:</span>
                Listings with clear descriptions and 5+ high-quality photos get 3x more responses.
              </p>
            </div>
          </aside>

          {/*  Main Form Canvas  */}
          <form onSubmit={handleSubmit} className="lg:col-span-9 space-y-12">

            {/*  Category Selection  */}
            <section className="bg-surface-container-low p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6 text-primary">I am looking for...</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative flex cursor-pointer" onClick={() => handleCategoryChange('pg')}>
                  <input type="radio" name="category" value="pg" className="peer sr-only" readOnly checked={formData.category === 'pg'} />
                  <div className="w-full p-6 bg-surface-container-lowest border-2 border-transparent rounded-xl peer-checked:border-primary peer-checked:bg-primary-fixed/20 transition-all">
                    <span className="material-symbols-outlined text-primary mb-2 block text-3xl">apartment</span>
                    <span className="block font-bold text-on-surface">PG / Hostel</span>
                    <span className="block text-xs text-on-surface-variant mt-1">Single or shared occupancy</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer" onClick={() => handleCategoryChange('flat')}>
                  <input type="radio" name="category" value="flat" className="peer sr-only" readOnly checked={formData.category === 'flat'} />
                  <div className="w-full p-6 bg-surface-container-lowest border-2 border-transparent rounded-xl peer-checked:border-primary peer-checked:bg-primary-fixed/20 transition-all">
                    <span className="material-symbols-outlined text-primary mb-2 block text-3xl">home</span>
                    <span className="block font-bold text-on-surface">Whole Flat</span>
                    <span className="block text-xs text-on-surface-variant mt-1">Entire 1/2/3 BHK units</span>
                  </div>
                </label>
                <label className="relative flex cursor-pointer" onClick={() => handleCategoryChange('roommate')}>
                  <input type="radio" name="category" value="roommate" className="peer sr-only" readOnly checked={formData.category === 'roommate'} />
                  <div className="w-full p-6 bg-surface-container-lowest border-2 border-transparent rounded-xl peer-checked:border-primary peer-checked:bg-primary-fixed/20 transition-all">
                    <span className="material-symbols-outlined text-primary mb-2 block text-3xl">group</span>
                    <span className="block font-bold text-on-surface">Roommate</span>
                    <span className="block text-xs text-on-surface-variant mt-1">Shared rental agreements</span>
                  </div>
                </label>
              </div>
            </section>

            {/*  Basic Details  */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface border-l-4 border-secondary pl-4">Property Essentials</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Listing Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all"
                    placeholder="e.g. Sunny Master Bedroom in Downtown Loft"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Detailed Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-outline transition-all"
                    placeholder="Describe the atmosphere, rules, and who you're looking for..."
                    rows="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Monthly Rent (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                    <input
                      type="number"
                      name="rent"
                      value={formData.rent}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-10 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="25,000"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Security Deposit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">₹</span>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-10 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="50,000"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/*  Location  */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface border-l-4 border-secondary pl-4">Location</h2>
              <div className="relative">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Search Address</label>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter building name, street or locality"
                      required
                    />
                  </div>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, address: 'Detected Location, NY' }))} className="px-6 bg-surface-container-high rounded-xl text-primary font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined">my_location</span>
                    <span className="hidden md:inline">Detect</span>
                  </button>
                </div>
              </div>
              <div className="h-64 bg-surface-container-high rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative">
                <img alt="Interactive city map layout with highlighted residential zones and street names in a clean architectural style" className="w-full h-full object-cover grayscale opacity-50" data-location="New York" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF3GYUkDlCKPQBDnjesUoJ3Gima2NZL3rFBs06Hbmw9sjilR-xmc6iqklBh82D3j5E8kgDPNhYu0rAdcT4X9IjX0UROgHhwgHt_FPcZnJlbPr92_LenjNMEAW0mDDvpZxZhfTo7heG-F41D_ppcEr_-Uhb5nlYC1IDJqIGk95NRuzMVgJpdjl_DXiGXFDWGiYlXWV3HGEp1RWb1QwoqTPwZicUJixgCR4JeBASQpob3Ui5BIo7uk7InPsCluortobFys1rl6MkL0QG" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-5xl text-primary drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
            </section>

            {/*  Amenities  */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface border-l-4 border-secondary pl-4">Amenities &amp; Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['High-speed Wi-Fi', 'Air Conditioning', 'Washing Machine', 'Pet Friendly', 'Kitchen Access', 'Power Backup', 'Parking Space', 'Gym Access'].map(item => (
                  <label key={item} className="flex items-center gap-3 p-4 bg-surface-container rounded-xl cursor-pointer hover:bg-surface-container-highest transition-all">
                    <input
                      type="checkbox"
                      name={item}
                      checked={formData.amenities.includes(item)}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded text-secondary focus:ring-secondary border-none bg-surface-container-lowest"
                    />
                    <span className="text-sm font-medium">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/*  Media Upload  */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-on-surface border-l-4 border-secondary pl-4">Property Photos</h2>
              <div className="border-4 border-dashed border-outline-variant/30 rounded-3xl p-12 text-center bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer">
                <div className="max-w-xs mx-auto">
                  <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-1">Upload Property Photos</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Drag and drop images, or click to browse files from your computer</p>
                  <button type="button" onClick={(e) => { e.preventDefault(); alert("File picker would open here"); }} className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm">Select Files</button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="aspect-square bg-surface-container-highest rounded-xl overflow-hidden relative group">
                  <img className="w-full h-full object-cover" alt="Property instance 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQYp0y-jxB-WLY2Vqp-RGsPZns-YohmVElJor9MUZRDfz8CBROEmYxA3NIV4Cts8zm13CO4x0IxkNFmepXp3j-E9qoIbTM3EbsQCu6UNp4N-AKlHtyvpNOOVMy2htPS2zDdDW-rUxrLpdhbjZh6ozq8-mKR9DgGjIOLOj3RTUsGzTWX0d9DM9HXXB4wUmn5EFxBz93V3--t67_5KzCEkmwBs8I-ZYuh4q7qm75muRFdemx0JuPSgs3jEUf8n_Q6E0GMgLw-3rqHt0h" />
                  <button type="button" onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="aspect-square bg-surface-container-highest rounded-xl overflow-hidden relative group">
                  <img className="w-full h-full object-cover" alt="Property instance 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAM3hDJWBwaY5gWfrHFAo8BBRbILWzbrx9jMolR8FjrgKOE3Y4WD1jQYqS4PgV6ZV6wm3q2XKkWf16kdt36LuVD-gbqyom9bPit2_CfWT6Dr9mqFgbD5-IP1UfT_prA4c0fR2h3_CHoBTlN50ocSFxdLx_urwlpr1Vr8gjZkQ2faFGLNkKaKqVgOjl8JNw51xkAPKD52LKiCVIhLQ-3UljwSITTziwWT8ChlV3eM3bvLBfBzBzsP-46OMtXNI8gs_Jzun7VZPdzlyDj" />
                  <button type="button" onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                <div className="aspect-square border-2 border-dashed border-outline-variant flex items-center justify-center rounded-xl text-outline-variant">
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
                <div className="aspect-square border-2 border-dashed border-outline-variant flex items-center justify-center rounded-xl text-outline-variant">
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
              </div>
            </section>

            {/*  Final Action  */}
            <div className="pt-12 border-t border-surface-container-highest flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-on-surface-variant italic text-sm">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                By clicking submit, you agree to our Safety Guidelines.
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button type="button" onClick={() => alert("Draft saved!")} className="flex-1 md:flex-none px-8 py-4 text-on-surface font-bold rounded-full hover:bg-surface-container transition-all">Save Draft</button>
                <button type="submit" className="flex-1 md:flex-none px-12 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-extrabold rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-lg">Submit Listing</button>
              </div>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
