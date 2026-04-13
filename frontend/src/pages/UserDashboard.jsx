import React, { useState, useContext, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { usersAPI, propertiesAPI, favoritesAPI, roommatesAPI } from '../api/services';
import toast from 'react-hot-toast';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
const LIFESTYLE_TAGS = ['Non-smoker', 'Vegetarian', 'Early bird', 'Night owl', 'Pet friendly', 'Gym freak', 'Foodie', 'Quiet', 'Social', 'Student', 'Working professional'];

export default function UserDashboard() {
  const { user, isAuthenticated, updateUser, logout } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: '', phone: '', bio: '', location: '', occupation: '', gender: ''
  });

  // Roommate profile state
  const [roommateProfile, setRoommateProfile] = useState(null);
  const [roommateLoading, setRoommateLoading] = useState(false);
  const [roommateForm, setRoommateForm] = useState({
    budget: '', preferredCities: [], gender: 'Any', tags: [],
    lookingFor: '', occupation: '', leaseDuration: 'Flexible'
  });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
        occupation: user.occupation || '',
        gender: user.gender || ''
      });
    }
    loadMyListings();
    loadFavorites();
    loadRoommateProfile();
  }, [isAuthenticated, user]);

  const loadMyListings = async () => {
    try {
      const res = await propertiesAPI.getMyListings();
      setMyListings(res.data.properties);
    } catch (error) { console.error(error); }
  };

  const loadFavorites = async () => {
    try {
      const res = await favoritesAPI.getAll('property');
      setFavorites(res.data.favorites);
    } catch (error) { console.error(error); }
  };

  const loadRoommateProfile = async () => {
    try {
      const res = await roommatesAPI.getMyProfile();
      const myProfile = res.data.roommate;
      if (myProfile) {
        setRoommateProfile(myProfile);
        setRoommateForm({
          budget: myProfile.budget || '',
          preferredCities: myProfile.preferredCities || [],
          gender: myProfile.gender || 'Any',
          tags: myProfile.tags || [],
          lookingFor: myProfile.lookingFor || '',
          occupation: myProfile.occupation || '',
          leaseDuration: myProfile.leaseDuration || 'Flexible'
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveRoommate = async () => {
    if (!roommateForm.budget) { toast.error('Please enter your budget'); return; }
    setRoommateLoading(true);
    try {
      const res = await roommatesAPI.createOrUpdate(roommateForm);
      setRoommateProfile(res.data.roommate);
      toast.success(roommateProfile ? 'Roommate profile updated! ✅' : 'Roommate profile created! 🎉');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save profile');
    } finally {
      setRoommateLoading(false);
    }
  };

  const handleDeactivateRoommate = async () => {
    if (!window.confirm('Remove your roommate profile?')) return;
    try {
      await roommatesAPI.deactivate();
      setRoommateProfile(null);
      toast.success('Roommate profile removed');
    } catch (e) { toast.error('Failed to remove profile'); }
  };

  const toggleTag = (tag) => setRoommateForm(prev => ({
    ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
  }));

  const toggleCity = (city) => setRoommateForm(prev => ({
    ...prev, preferredCities: prev.preferredCities.includes(city) ? prev.preferredCities.filter(c => c !== city) : [...prev.preferredCities, city]
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile(formData);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('avatar', file);
    try {
      const res = await usersAPI.uploadAvatar(data);
      updateUser(res.data.user);
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Remove this listing?')) return;
    try {
      await propertiesAPI.delete(id);
      setMyListings(prev => prev.filter(p => p._id !== id));
      toast.success('Listing removed');
    } catch (error) {
      toast.error('Failed to remove listing');
    }
  };

  const avatarUrl = user?.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=1e3a5f&color=fff&size=200`;

  const getPropertyImage = (p) => {
    const img = p.images?.[0];
    if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const MODERATION_BADGE = {
    pending:  { label: 'Under Review', color: 'bg-yellow-500/20 text-yellow-600', icon: 'pending' },
    approved: { label: 'Live', color: 'bg-green-500/20 text-green-600', icon: 'check_circle' },
    rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-600', icon: 'cancel' },
  };

  if (!user) return null;

  const isEmailUnverified = !user.isEmailVerified;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-32 px-4 md:px-6 max-w-7xl mx-auto">

        {/* Email verification banner */}
        {isEmailUnverified && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-500">mark_email_unread</span>
            <div className="flex-1">
              <p className="text-amber-800 font-semibold text-sm">Your email is not verified</p>
              <p className="text-amber-600 text-xs mt-0.5">Verify your email to increase trust and unlock all features.</p>
            </div>
            <Link to="/sign-up" className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-colors">
              Verify Now
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-surface-container-lowest rounded-xl p-8 text-center space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface-container-low">
                  <img className="w-full h-full object-cover" alt="Profile" src={avatarUrl} />
                </div>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </label>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{user.fullName}</h1>
                <p className="text-on-surface-variant flex items-center justify-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {user.location || 'Location not set'}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">{user.email}</p>
              </div>
              <Link to="/create-post" className="block w-full py-3 bg-primary-container text-white font-bold rounded-full hover:opacity-90 transition-opacity text-center">
                + List a Property
              </Link>
            </section>

            <section className="bg-surface-container-low rounded-xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">Identity Trust</h3>
                <span className="px-3 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-xs font-bold rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Level {user.verificationLevel || 0}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Verified users are 3x more likely to find compatible roommates within the first week.
              </p>
              <button className="w-full py-3 bg-surface-container-highest text-primary font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">upload_file</span>
                Upgrade Verification
              </button>
            </section>

            <section className="bg-surface-container-lowest rounded-xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Account</h3>
              <div className="space-y-3">
                <Link to="/messages" className="flex items-center justify-between group">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">Messages</span>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
                <Link to="/roommate-listing" className="flex items-center justify-between group">
                  <span className="text-on-surface-variant group-hover:text-primary transition-colors">Find Roommates</span>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
                <button onClick={logout} className="flex items-center justify-between w-full group">
                  <span className="text-red-500 group-hover:text-red-700 transition-colors">Sign Out</span>
                  <span className="material-symbols-outlined text-red-400">logout</span>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-outline-variant/20 pb-0 overflow-x-auto">
              {['profile', 'listings', 'favorites', 'roommate'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-semibold text-sm capitalize transition-all border-b-2 -mb-px whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
                  {tab === 'listings' ? `Listings (${myListings.length})` : tab === 'favorites' ? `Saved (${favorites.length})` : tab === 'roommate' ? '🏠 Roommate Profile' : 'Profile'}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <section className="bg-surface-container-lowest rounded-xl p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-surface-container-high pb-6">
                  <h2 className="text-2xl font-extrabold tracking-tight">Personal Details</h2>
                  {editing ? (
                    <div className="flex gap-3">
                      <button onClick={() => setEditing(false)} className="text-on-surface-variant font-semibold text-sm px-4 py-2 rounded-full hover:bg-surface-container">Cancel</button>
                      <button onClick={handleSave} disabled={saving}
                        className="bg-primary text-white font-bold text-sm px-5 py-2 rounded-full hover:opacity-90 disabled:opacity-60 flex items-center gap-2">
                        {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                        Save
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(true)} className="text-secondary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', key: 'fullName', type: 'text' },
                    { label: 'Phone Number', key: 'phone', type: 'tel' },
                    { label: 'Location', key: 'location', type: 'text' },
                    { label: 'Occupation', key: 'occupation', type: 'text' },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
                      {editing ? (
                        <input type={type} value={formData[key]} onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full px-4 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                      ) : (
                        <p className="text-lg font-medium text-on-surface">{user[key] || <span className="text-outline italic text-sm">Not set</span>}</p>
                      )}
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Gender</label>
                    {editing ? (
                      <select value={formData.gender} onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                        <option value="">Prefer not to say</option>
                        <option>Male</option><option>Female</option><option>Non-binary</option>
                      </select>
                    ) : (
                      <p className="text-lg font-medium text-on-surface">{user.gender || <span className="text-outline italic text-sm">Not set</span>}</p>
                    )}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">About Me</label>
                    {editing ? (
                      <textarea value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))} rows={3}
                        className="w-full px-4 py-2.5 bg-surface-container-highest rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none"
                        placeholder="Tell potential roommates about yourself..." />
                    ) : (
                      <p className="text-on-surface-variant leading-relaxed italic">{user.bio || <span className="not-italic">No bio yet. Click Edit to add one.</span>}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <section className="space-y-6">
                {myListings.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-lowest rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-outline-variant">home</span>
                    <p className="text-on-surface-variant mt-4">No listings yet</p>
                    <Link to="/create-post" className="mt-4 inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
                      Create Your First Listing
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myListings.map(p => {
                      const mod = MODERATION_BADGE[p.moderationStatus] || MODERATION_BADGE.pending;
                      return (
                      <div key={p._id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                        <div className="relative h-48">
                          <img src={getPropertyImage(p)} alt={p.title} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3">
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${mod.color} bg-white/90`}>
                              <span className="material-symbols-outlined text-xs">{mod.icon}</span>
                              {mod.label}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-2">
                            <button onClick={() => handleDeleteListing(p._id)}
                              className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-on-surface text-sm line-clamp-1">{p.title}</h3>
                          <p className="text-primary font-bold mt-1">₹{p.price?.toLocaleString('en-IN')}/mo</p>
                          <p className="text-on-surface-variant text-xs mt-1">{p.neighborhood || p.city}</p>
                          {p.moderationStatus === 'rejected' && p.moderationNote && (
                            <p className="text-red-500 text-xs mt-2 bg-red-50 px-2 py-1 rounded-lg">
                              <span className="font-bold">Reason:</span> {p.moderationNote}
                            </p>
                          )}
                          {p.moderationStatus === 'pending' && (
                            <p className="text-amber-600 text-xs mt-2">⏳ Awaiting admin approval before going live</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-on-surface-variant">{p.views || 0} views</span>
                            <Link to={`/property-details/${p._id}`} className="text-xs text-primary font-semibold hover:underline">View →</Link>
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>
                )}
              </section>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <section className="space-y-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-lowest rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-outline-variant">favorite</span>
                    <p className="text-on-surface-variant mt-4">No favorites yet</p>
                    <Link to="/find-homes" className="mt-4 inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
                      Browse Listings
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map(fav => {
                      const p = fav.property;
                      if (!p) return null;
                      return (
                        <div key={fav._id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
                          <div className="relative h-48">
                            <img src={getPropertyImage(p)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3">
                              <span className="bg-white/90 p-2 rounded-full text-red-500 shadow-md flex">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-on-surface text-sm line-clamp-1 flex-1 mr-2">{p.title}</h3>
                              <p className="text-primary font-extrabold whitespace-nowrap">₹{p.price?.toLocaleString('en-IN')}<span className="text-xs font-normal text-on-surface-variant">/mo</span></p>
                            </div>
                            <p className="text-on-surface-variant text-xs mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">location_on</span>{p.neighborhood || p.city}
                            </p>
                            <Link to={`/property-details/${p._id}`} className="mt-3 block text-center py-2 bg-primary/10 text-primary font-bold rounded-full text-xs hover:bg-primary hover:text-white transition-all">
                              View Property
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* Roommate Profile Tab */}
            {activeTab === 'roommate' && (
              <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-on-surface">Roommate Profile</h2>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {roommateProfile ? 'Your profile is visible to others on the roommate listing.' : 'Create a profile to appear in roommate search results.'}
                    </p>
                  </div>
                  {roommateProfile && (
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Active
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Monthly Budget (₹) *</label>
                    <input type="number" value={roommateForm.budget} onChange={e => setRoommateForm(p => ({ ...p, budget: e.target.value }))}
                      placeholder="e.g. 12000"
                      className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                  </div>

                  {/* Preferred Cities */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Preferred Cities</label>
                    <div className="flex flex-wrap gap-2">
                      {CITIES.map(city => (
                        <button key={city} type="button" onClick={() => toggleCity(city)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${roommateForm.preferredCities.includes(city) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender & Lease */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Gender</label>
                      <select value={roommateForm.gender} onChange={e => setRoommateForm(p => ({ ...p, gender: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                        <option>Any</option><option>Male</option><option>Female</option><option>Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Lease Duration</label>
                      <select value={roommateForm.leaseDuration} onChange={e => setRoommateForm(p => ({ ...p, leaseDuration: e.target.value }))}
                        className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                        <option>Flexible</option><option>1-3 months</option><option>3-6 months</option><option>6-12 months</option><option>1+ year</option>
                      </select>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Occupation</label>
                    <input type="text" value={roommateForm.occupation} onChange={e => setRoommateForm(p => ({ ...p, occupation: e.target.value }))}
                      placeholder="e.g. Software Engineer, MBA Student"
                      className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                  </div>

                  {/* Lifestyle Tags */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Lifestyle Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {LIFESTYLE_TAGS.map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${roommateForm.tags.includes(tag) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Looking For */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">About You / What You're Looking For</label>
                    <textarea value={roommateForm.lookingFor} onChange={e => setRoommateForm(p => ({ ...p, lookingFor: e.target.value }))}
                      rows={3} placeholder="Tell potential roommates about yourself and what you're looking for..."
                      className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none text-sm" />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button onClick={handleSaveRoommate} disabled={roommateLoading}
                      className="flex-1 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                      {roommateLoading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
                        : <><span className="material-symbols-outlined text-sm">save</span> {roommateProfile ? 'Update Profile' : 'Create Profile'}</>}
                    </button>
                    {roommateProfile && (
                      <button onClick={handleDeactivateRoommate}
                        className="px-5 py-3.5 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-colors text-sm">
                        Remove
                      </button>
                    )}
                  </div>

                  {roommateProfile && (
                    <Link to={`/view-roommate/${roommateProfile._id}`}
                      className="block text-center text-sm text-primary font-semibold hover:underline">
                      View your public profile →
                    </Link>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
