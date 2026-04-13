import React, { useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { propertiesAPI, bookingsAPI, messagesAPI, reviewsAPI } from '../api/services';
import { addRecentlyViewed } from '../hooks/useRecentlyViewed';
import toast from 'react-hot-toast';

const AMENITY_ICONS = {
  'WiFi': 'wifi', 'Air Conditioning': 'ac_unit', 'Parking': 'local_parking',
  'Laundry': 'local_laundry_service', 'Gym': 'fitness_center', 'Pool': 'pool',
  'Pet Friendly': 'pets', 'Furnished': 'chair', 'Balcony': 'balcony',
  'Kitchen': 'kitchen', 'Security': 'security', 'Elevator': 'elevator'
};

export default function PropertyDetails() {
  const { id } = useParams();
  const { isAuthenticated, user, toggleFavoriteProperty, favoriteProperties } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({ checkIn: '', months: 1, message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (id) loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const res = await propertiesAPI.getOne(id);
      setProperty(res.data.property);
      addRecentlyViewed(res.data.property);
      loadReviews();
    } catch (e) {
      toast.error('Property not found');
      navigate('/find-homes');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await reviewsAPI.getAll(id);
      setReviews(res.data.reviews);
    } catch (e) { /* silent */ }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to leave a review'); navigate('/login'); return; }
    if (!reviewForm.rating) { toast.error('Please select a rating'); return; }
    setReviewLoading(true);
    try {
      const res = await reviewsAPI.create(id, reviewForm);
      setReviews(prev => [res.data.review, ...prev]);
      setReviewForm({ rating: 0, comment: '' });
      toast.success('Review submitted! ⭐');
      // refresh property to get updated averageRating
      const propRes = await propertiesAPI.getOne(id);
      setProperty(propRes.data.property);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.delete(id, reviewId);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch (e) {
      toast.error('Failed to delete review');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!booking.checkIn) { toast.error('Please select a check-in date'); return; }
    setBookingLoading(true);
    try {
      await bookingsAPI.create({ propertyId: id, ...booking });
      toast.success('Booking request sent! 🎉');
      setShowBooking(false);
      navigate('/bookings');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) { toast.error('Please login to message'); navigate('/login'); return; }
    try {
      const res = await messagesAPI.startConversation(property.owner._id);
      navigate('/messages');
    } catch (e) {
      toast.error('Could not start conversation');
    }
  };

  const getImg = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const getOwnerAvatar = (owner) => {
    if (!owner) return '';
    const img = owner.profileImage;
    if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(owner.fullName || 'O')}&background=1e3a5f&color=fff&size=128`;
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const isFav = property && favoriteProperties.includes(property._id);

  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out this property on ShareNest: ${property.title} - ₹${property.price?.toLocaleString('en-IN')}/mo in ${property.city}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied! 📋');
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-24 max-w-screen-2xl mx-auto px-8">
        <div className="h-[500px] bg-surface-container-highest rounded-xl animate-pulse mb-8"></div>
      </div>
    </>
  );

  if (!property) return null;

  const images = property.images?.length > 0 ? property.images : [''];

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24 md:pb-20 max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* Image Gallery */}
        <section className="mb-6 md:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-64 md:h-[420px]">
            <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-xl">
              <img src={getImg(images[activeImg])} alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="hidden md:block overflow-hidden rounded-xl cursor-pointer" onClick={() => setActiveImg(i + 1)}>
                <img src={getImg(img)} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
            {images.length < 5 && [...Array(Math.max(0, 4 - images.length))].map((_, i) => (
              <div key={`empty-${i}`} className="hidden md:block overflow-hidden rounded-xl bg-surface-container-high"></div>
            ))}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 md:hidden overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary' : 'border-transparent'}`}>
                  <img src={getImg(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {property.verified && (
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> Verified Listing
                  </span>
                )}
                {property.isMoveInReady && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>home</span> Move-in Ready
                  </span>
                )}
                {property.videoTourUrl && (
                  <a href={property.videoTourUrl} target="_blank" rel="noopener noreferrer"
                    className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-red-100 transition-colors">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span> Video Tour
                  </a>
                )}
                <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-xs font-medium capitalize">{property.category?.replace('-', ' ')}</span>
                <span className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {property.availableFrom
                    ? `Available from ${new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`
                    : new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">{property.title}</h1>
              <p className="text-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                {property.address}, {property.city}
              </p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Monthly Rent</span>
                <div className="mt-3">
                  <span className="text-4xl font-black text-primary">₹{property.price?.toLocaleString('en-IN')}</span>
                  <span className="text-on-surface-variant text-sm">/month</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">Security Deposit</span>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-on-surface">₹{property.deposit?.toLocaleString('en-IN') || '0'}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">bed</span>{property.bedroomCount} Bedroom
              </span>
              <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">bathtub</span>{property.bathroomCount} Bathroom
              </span>
              <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-primary text-sm">meeting_room</span>{property.roomType}
              </span>
              {property.genderPref && property.genderPref !== 'Any' && (
                <span className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>{property.genderPref} preferred
                </span>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-on-surface border-l-4 border-primary pl-4">About this Space</h2>
                <p className="text-on-surface-variant leading-relaxed text-base">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-on-surface">What this place offers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-3 text-on-surface">
                      <span className="material-symbols-outlined p-2.5 bg-surface-container-low rounded-xl text-primary text-sm">
                        {AMENITY_ICONS[a] || 'check_circle'}
                      </span>
                      <span className="font-medium text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Looking For */}
            {property.lookingFor?.length > 0 && (
              <div className="bg-primary-container p-6 rounded-xl space-y-3">
                <h3 className="font-bold text-lg text-on-primary-container flex items-center gap-2">
                  <span className="material-symbols-outlined">group</span> Looking for
                </h3>
                <ul className="space-y-2">
                  {property.lookingFor.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-on-primary-container text-sm">
                      <span className="material-symbols-outlined text-xs">check_circle</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Neighborhood Safety Score */}
            {property.neighborhoodSafety?.overallScore > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                  Neighborhood Safety
                </h2>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  {/* Overall Score */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-extrabold text-2xl">{property.neighborhoodSafety.overallScore}</span>
                    </div>
                    <div>
                      <p className="font-bold text-green-800 text-lg">
                        {property.neighborhoodSafety.overallScore >= 4 ? 'Very Safe' : property.neighborhoodSafety.overallScore >= 3 ? 'Safe' : 'Moderate'}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {[1,2,3,4,5].map(s => (
                          <div key={s} className={`h-2 w-8 rounded-full ${s <= property.neighborhoodSafety.overallScore ? 'bg-green-500' : 'bg-green-200'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Safety badges */}
                  <div className="flex flex-wrap gap-2">
                    {property.neighborhoodSafety.safeForWomen && (
                      <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>female</span> Safe for Women
                      </span>
                    )}
                    {property.neighborhoodSafety.metroNearby && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">train</span> Metro Nearby
                      </span>
                    )}
                    {property.neighborhoodSafety.marketNearby && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">shopping_bag</span> Market Nearby
                      </span>
                    )}
                    {property.neighborhoodSafety.hospitalNearby && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">local_hospital</span> Hospital Nearby
                      </span>
                    )}
                    {property.neighborhoodSafety.wellLit && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>light_mode</span> Well Lit Streets
                      </span>
                    )}
                    {property.neighborhoodSafety.lowCrime && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>security</span> Low Crime Area
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── REVIEWS ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-on-surface">Reviews</h2>
                {property.reviewCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-bold text-amber-700">{property.averageRating}</span>
                    <span className="text-amber-600 text-sm">({property.reviewCount})</span>
                  </div>
                )}
              </div>

              {/* Review Form */}
              {isAuthenticated && property.owner?._id !== user?._id && (
                <form onSubmit={handleSubmitReview} className="bg-surface-container-low rounded-xl p-6 space-y-4">
                  <p className="font-semibold text-on-surface text-sm">Leave a Review</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                        className="transition-transform hover:scale-110">
                        <span className="material-symbols-outlined text-3xl"
                          style={{ fontVariationSettings: `'FILL' ${(hoverRating || reviewForm.rating) >= star ? 1 : 0}`, color: (hoverRating || reviewForm.rating) >= star ? '#f59e0b' : '#d1d5db' }}>
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <textarea value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    rows={3} placeholder="Share your experience with this property..."
                    className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none text-sm" />
                  <button type="submit" disabled={reviewLoading}
                    className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2">
                    {reviewLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Submitting...</> : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 block">rate_review</span>
                  <p className="text-sm">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review._id} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.reviewer?.profileImage
                              ? (review.reviewer.profileImage.startsWith('http') ? review.reviewer.profileImage : `http://localhost:5000${review.reviewer.profileImage}`)
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer?.fullName || 'U')}&background=1e3a5f&color=fff&size=64`}
                            alt="" className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-on-surface text-sm">{review.reviewer?.fullName}</p>
                            <p className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: `'FILL' ${review.rating >= s ? 1 : 0}`, color: review.rating >= s ? '#f59e0b' : '#d1d5db' }}>star</span>
                            ))}
                          </div>
                          {user && review.reviewer?._id === user._id && (
                            <button onClick={() => handleDeleteReview(review._id)}
                              className="text-outline hover:text-error transition-colors ml-1">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                      {review.comment && <p className="text-on-surface-variant text-sm mt-3 leading-relaxed">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="relative">
            <div className="sticky top-28 space-y-6">
              {/* Owner Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/15 space-y-5">
                <div className="flex items-center gap-4">
                  <img src={getOwnerAvatar(property.owner)} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{property.owner?.fullName}</h3>
                    {property.owner?.verificationLevel > 0 && (
                      <p className="text-sm text-on-tertiary-container flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Verified Owner
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3 pt-3 border-t border-surface-container">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Views</span>
                    <span className="font-bold">{property.views || 0}</span>
                  </div>
                  {property.reviewCount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Rating</span>
                      <span className="font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {property.averageRating} ({property.reviewCount})
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Listed</span>
                    <span className="font-bold">{new Date(property.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <button onClick={() => setShowBooking(true)}
                    className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[0.98] transition-all">
                    <span className="material-symbols-outlined">hotel</span> Book Now
                  </button>
                  <button onClick={handleMessage}
                    className="w-full bg-secondary-container text-on-secondary-container py-3.5 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined">chat_bubble</span> Message Owner
                  </button>
                  <button onClick={() => toggleFavoriteProperty(property._id)}
                    className="w-full border border-outline-variant/30 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0", color: isFav ? '#ef4444' : undefined }}>favorite</span>
                    {isFav ? 'Saved' : 'Save for Later'}
                  </button>
                  {/* Share buttons */}
                  <div className="flex gap-2">
                    <button onClick={handleShare}
                      className="flex-1 border border-green-200 bg-green-50 text-green-700 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-green-100 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.4l-.37-.22-3.76.895.952-3.67-.24-.38A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                      WhatsApp
                    </button>
                    <button onClick={handleCopyLink}
                      className="flex-1 border border-outline-variant/30 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-surface-container-low p-5 rounded-xl text-sm space-y-2">
                <p className="font-bold text-on-surface mb-3">Price Breakdown</p>
                <div className="flex justify-between"><span className="text-on-surface-variant">Monthly rent</span><span className="font-semibold">₹{property.price?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Security deposit</span><span className="font-semibold">₹{property.deposit?.toLocaleString('en-IN') || '0'}</span></div>
                <div className="border-t border-outline-variant/20 pt-2 flex justify-between font-bold">
                  <span>Move-in total</span>
                  <span className="text-primary">₹{((property.price || 0) + (property.deposit || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface-container-lowest border-t border-outline-variant/20 p-3 flex gap-3">
        <button onClick={() => setShowBooking(true)}
          className="flex-1 bg-gradient-to-br from-primary to-primary-container text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">hotel</span> Book Now
        </button>
        <button onClick={handleMessage}
          className="flex-1 bg-secondary-container text-on-secondary-container py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">chat_bubble</span> Message
        </button>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-on-surface">Book this Room</h2>
              <button onClick={() => setShowBooking(false)} className="p-2 hover:bg-surface-container rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 mb-6">
              <p className="font-bold text-on-surface text-sm line-clamp-1">{property.title}</p>
              <p className="text-primary font-extrabold text-lg mt-1">₹{property.price?.toLocaleString('en-IN')}/month</p>
            </div>
            <form onSubmit={handleBook} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Check-in Date *</label>
                <input type="date" value={booking.checkIn} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBooking(p => ({ ...p, checkIn: e.target.value }))} required
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Duration (months)</label>
                <select value={booking.months} onChange={e => setBooking(p => ({ ...p, months: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface">
                  {[1,2,3,6,12].map(m => <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Message to Owner (optional)</label>
                <textarea value={booking.message} onChange={e => setBooking(p => ({ ...p, message: e.target.value }))}
                  rows={3} placeholder="Introduce yourself, mention your move-in reason..."
                  className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface resize-none text-sm" />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Total ({booking.months} mo)</span>
                <span className="text-xl font-extrabold text-primary">₹{(property.price * booking.months).toLocaleString('en-IN')}</span>
              </div>
              <button type="submit" disabled={bookingLoading}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {bookingLoading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</> : 'Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
