import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { propertiesAPI } from '../api/services';
import toast from 'react-hot-toast';

const AMENITIES = ['WiFi', 'Air Conditioning', 'Parking', 'Laundry', 'Gym', 'Pool', 'Pet Friendly', 'Furnished', 'Balcony', 'Kitchen', 'Security', 'Elevator'];

export default function CreatePost() {
  const { isAuthenticated, fetchProperties } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    category: 'pg',
    title: '',
    description: '',
    price: '',
    deposit: '',
    address: '',
    neighborhood: '',
    city: '',
    roomType: 'Single Room',
    bedroomCount: 1,
    bathroomCount: 1,
    genderPref: 'Any',
    amenities: [],
    lookingFor: [],
    videoTourUrl: '',
    isMoveInReady: false,
    availableFrom: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'amenities') {
      setFormData(prev => ({
        ...prev,
        amenities: checked ? [...prev.amenities, value] : prev.amenities.filter(a => a !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to list a property');
      navigate('/login');
      return;
    }
    if (!formData.title || !formData.price || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach(v => data.append(key, v));
        } else {
          data.append(key, val);
        }
      });
      images.forEach(img => data.append('images', img));

      await propertiesAPI.create(data);
      await fetchProperties();
      toast.success('Listing submitted for review! 🎉 Admin will approve it shortly.');
      navigate('/user-dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create listing';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight">List Your Property</h1>
          <p className="text-on-surface-variant mt-2">Fill in the details to find your perfect roommate.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Category */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Property Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">              {[
                { val: 'pg', label: 'PG / Hostel', icon: 'apartment' },
                { val: 'flat', label: 'Whole Flat', icon: 'home' },
                { val: 'private-room', label: 'Private Room', icon: 'bedroom_parent' },
                { val: 'studio', label: 'Studio', icon: 'meeting_room' }
              ].map(({ val, label, icon }) => (
                <button key={val} type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: val }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${formData.category === val ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40'}`}>
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Basic Info */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Title *</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  placeholder="e.g. Sunny private room in Brooklyn Heights" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
                  placeholder="Describe the space, vibe, and what makes it special..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Monthly Rent (₹) *</label>
                  <input name="price" value={formData.price} onChange={handleInputChange} required type="number" min="0"
                    className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    placeholder="12000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Security Deposit (₹)</label>
                  <input name="deposit" value={formData.deposit} onChange={handleInputChange} type="number" min="0"
                    className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    placeholder="24000" />
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Full Address *</label>
                <input name="address" value={formData.address} onChange={handleInputChange} required
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  placeholder="123 Main St, Apt 4B" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Neighborhood</label>
                <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  placeholder="Brooklyn Heights" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">City *</label>
                <input name="city" value={formData.city} onChange={handleInputChange} required
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  placeholder="New York" />
              </div>
            </div>
          </section>

          {/* Room Details */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Room Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                  <option>Single Room</option>
                  <option>Shared Space</option>
                  <option>Entire Flat</option>
                  <option>Studio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bedrooms</label>
                <input name="bedroomCount" value={formData.bedroomCount} onChange={handleInputChange} type="number" min="1"
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Bathrooms</label>
                <input name="bathroomCount" value={formData.bathroomCount} onChange={handleInputChange} type="number" min="1"
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Gender Pref.</label>
                <select name="genderPref" value={formData.genderPref} onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                  <option>Any</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                </select>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {AMENITIES.map(amenity => (
                <label key={amenity} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.amenities.includes(amenity) ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'}`}>
                  <input type="checkbox" name="amenities" value={amenity}
                    checked={formData.amenities.includes(amenity)} onChange={handleInputChange} className="hidden" />
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${formData.amenities.includes(amenity) ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                    {formData.amenities.includes(amenity) && <span className="material-symbols-outlined text-white text-xs">check</span>}
                  </span>
                  <span className="text-sm font-medium text-on-surface">{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Photos</h2>
            <div className="border-2 border-dashed border-outline-variant/40 rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
              <input type="file" id="images" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-outline-variant">add_photo_alternate</span>
                <span className="text-on-surface-variant font-medium">Click to upload photos</span>
                <span className="text-xs text-outline">JPEG, PNG, WebP up to 5MB each (max 10)</span>
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Availability & Video Tour */}
          <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-on-surface">Availability & Extras</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Available From</label>
                <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="moveInReady" checked={formData.isMoveInReady}
                  onChange={e => setFormData(p => ({ ...p, isMoveInReady: e.target.checked }))}
                  className="w-5 h-5 accent-primary rounded" />
                <label htmlFor="moveInReady" className="text-sm font-semibold text-on-surface cursor-pointer">
                  Move-in Ready 🏠 <span className="text-on-surface-variant font-normal">(Room is ready right now)</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Video Tour URL <span className="text-on-surface-variant font-normal">(YouTube link — optional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">videocam</span>
                <input type="url" name="videoTourUrl" value={formData.videoTourUrl} onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
              </div>
            </div>
          </section>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate(-1)}
              className="flex-1 py-4 border-2 border-outline-variant rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Publishing...</>
              ) : (
                <><span className="material-symbols-outlined">publish</span> Publish Listing</>
              )}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
