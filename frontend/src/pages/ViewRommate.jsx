import React, { useEffect, useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { roommatesAPI, messagesAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function ViewRommate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, toggleFavoriteRoommate, favoriteRoommates } = useContext(GlobalContext);
  const [roommate, setRoommate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [messaging, setMessaging] = useState(false);

  useEffect(() => {
    if (id) loadRoommate();
  }, [id]);

  const loadRoommate = async () => {
    try {
      const res = await roommatesAPI.getOne(id);
      setRoommate(res.data.roommate);
      setCompatibilityScore(res.data.compatibilityScore);
    } catch (e) {
      toast.error('Roommate profile not found');
      navigate('/roommate-listing');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) { toast.error('Please login to send a message'); navigate('/login'); return; }
    setMessaging(true);
    try {
      await messagesAPI.startConversation(roommate.user._id);
      navigate('/messages');
    } catch (e) {
      toast.error('Could not start conversation');
    } finally {
      setMessaging(false);
    }
  };

  const getAvatarUrl = (profileImage, fullName) => {
    if (!profileImage) return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'U')}&background=1e3a5f&color=fff&size=200&bold=true`;
    return profileImage.startsWith('http') ? profileImage : `http://localhost:5000${profileImage}`;
  };

  const isFav = roommate && favoriteRoommates.includes(roommate._id);
  const isOwnProfile = user && roommate?.user?._id === user._id;

  const scoreColor = compatibilityScore >= 70 ? 'text-green-600 bg-green-50 border-green-200' : compatibilityScore >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-slate-600 bg-slate-100 border-slate-200';
  const scoreLabel = compatibilityScore >= 70 ? 'Great Match! 🎉' : compatibilityScore >= 40 ? 'Good Match' : 'Partial Match';

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-8 animate-pulse">
              <div className="flex gap-8">
                <div className="w-48 h-48 bg-surface-container-high rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-4 pt-4">
                  <div className="h-8 bg-surface-container-high rounded w-3/4"></div>
                  <div className="h-4 bg-surface-container-high rounded w-1/2"></div>
                  <div className="h-4 bg-surface-container-high rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (!roommate) return null;

  const { user: roommateUser, budget, preferredCities, gender, tags, lookingFor, occupation, leaseDuration } = roommate;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left: Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="relative w-40 h-40 md:w-52 md:h-52 flex-shrink-0">
                  <img
                    src={getAvatarUrl(roommateUser?.profileImage, roommateUser?.fullName)}
                    alt={roommateUser?.fullName}
                    className="w-full h-full object-cover rounded-xl shadow-md"
                  />
                  {roommateUser?.verificationLevel > 0 && (
                    <div className="absolute -bottom-3 -right-3 bg-on-tertiary-container text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Verified
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{roommateUser?.fullName}</h1>
                    <p className="text-lg text-on-surface-variant font-medium mt-1">
                      {occupation || roommateUser?.occupation || 'Professional'}
                      {roommateUser?.location ? ` • ${roommateUser.location}` : ''}
                    </p>
                  </div>

                  {/* Tags */}
                  {tags?.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {tags.map((tag, i) => (
                        <span key={i} className="bg-surface-container text-on-surface px-3 py-1.5 rounded-full text-sm font-medium">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Bio */}
                  {roommateUser?.bio && (
                    <p className="text-on-surface-variant leading-relaxed pt-2 max-w-xl">{roommateUser.bio}</p>
                  )}

                  {/* Compatibility Score — enhanced */}
                  {compatibilityScore !== null && !isOwnProfile && (
                    <div className={`border rounded-2xl p-4 ${scoreColor}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-extrabold text-lg">{compatibilityScore}% Match</span>
                        <span className="font-bold text-sm">{scoreLabel}</span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2.5 bg-black/10 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${compatibilityScore}%`, background: compatibilityScore >= 70 ? '#16a34a' : compatibilityScore >= 40 ? '#d97706' : '#64748b' }}>
                        </div>
                      </div>
                      {/* Why you match */}
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Why you match</p>
                      <div className="flex flex-wrap gap-1.5">
                        {roommate.preferredCities?.some(c => c) && <span className="text-xs bg-black/10 px-2 py-1 rounded-full font-medium">📍 City overlap</span>}
                        {Math.abs((roommate.budget || 0) - 12000) / Math.max(roommate.budget || 1, 12000) <= 0.3 && <span className="text-xs bg-black/10 px-2 py-1 rounded-full font-medium">💰 Similar budget</span>}
                        {roommate.tags?.length > 0 && <span className="text-xs bg-black/10 px-2 py-1 rounded-full font-medium">🏷️ Shared lifestyle</span>}
                        {roommate.leaseDuration && <span className="text-xs bg-black/10 px-2 py-1 rounded-full font-medium">📅 Same lease duration</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Preferences */}
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">tune</span> Preferences
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Budget</span>
                    <span className="font-bold text-primary">₹{budget?.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Gender</span>
                    <span className="font-semibold">{gender || 'Any'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Lease Duration</span>
                    <span className="font-semibold">{leaseDuration || 'Flexible'}</span>
                  </div>
                  {preferredCities?.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Preferred Cities</span>
                      <span className="font-semibold text-right">{preferredCities.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Looking For */}
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">search_check</span> Looking For
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed italic">
                  "{lookingFor || 'Looking for a compatible roommate to share a space with.'}"
                </p>
              </div>

              {/* Interests */}
              {roommateUser?.interests?.length > 0 && (
                <div className="bg-surface-container-low rounded-xl p-6 space-y-4 md:col-span-2">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">palette</span> Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {roommateUser.interests.map((interest, i) => (
                      <span key={i} className="bg-white border border-outline-variant/20 text-on-surface px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6 sticky top-28">

            {/* Action Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-surface-container">
                <img src={getAvatarUrl(roommateUser?.profileImage, roommateUser?.fullName)}
                  alt="" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-on-surface">{roommateUser?.fullName}</p>
                  <p className="text-xs text-on-surface-variant">Member since {new Date(roommate.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {!isOwnProfile ? (
                <>
                  <button onClick={handleMessage} disabled={messaging}
                    className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60">
                    {messaging
                      ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Opening...</>
                      : <><span className="material-symbols-outlined">send</span> Send Message</>}
                  </button>
                  <button onClick={() => toggleFavoriteRoommate(roommate._id)}
                    className="w-full py-3 border border-outline-variant/30 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0", color: isFav ? '#ef4444' : undefined }}>
                      favorite
                    </span>
                    {isFav ? 'Saved' : 'Save to Favorites'}
                  </button>
                </>
              ) : (
                <div className="text-center py-2 text-on-surface-variant text-sm">This is your profile</div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-surface-container-low rounded-xl p-6 space-y-3 text-sm">
              <p className="font-bold text-on-surface mb-4">Quick Info</p>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Budget</span>
                <span className="font-bold text-primary">₹{budget?.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Lease</span>
                <span className="font-semibold">{leaseDuration || 'Flexible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Gender</span>
                <span className="font-semibold">{gender || 'Any'}</span>
              </div>
              {compatibilityScore !== null && !isOwnProfile && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Match Score</span>
                  <span className={`font-bold ${compatibilityScore >= 70 ? 'text-green-600' : compatibilityScore >= 40 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {compatibilityScore}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
