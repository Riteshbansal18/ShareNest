import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { bookingsAPI } from '../api/services';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700'
};

export default function Bookings() {
  const { isAuthenticated } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('my');
  const [myBookings, setMyBookings] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    loadAll();
  }, [isAuthenticated]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [myRes, recRes] = await Promise.all([bookingsAPI.getMy(), bookingsAPI.getReceived()]);
      setMyBookings(myRes.data.bookings);
      setReceived(recRes.data.bookings);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      toast.success(`Booking ${status}`);
      loadAll();
    } catch (e) { toast.error('Failed to update booking'); }
  };

  const getImg = (p) => {
    const img = p?.images?.[0];
    if (!img) return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400';
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const getAvatar = (u) => {
    if (!u) return '';
    const img = u.profileImage;
    if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'U')}&background=1e3a5f&color=fff&size=64`;
    return img.startsWith('http') ? img : `http://localhost:5000${img}`;
  };

  const BookingCard = ({ booking, isOwner }) => (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row">
      <div className="sm:w-40 h-40 sm:h-auto flex-shrink-0">
        <img src={getImg(booking.property)} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold text-on-surface text-sm line-clamp-1">{booking.property?.title}</h3>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 capitalize ${STATUS_COLORS[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <p className="text-on-surface-variant text-xs flex items-center gap-1 mb-3">
            <span className="material-symbols-outlined text-xs">location_on</span>
            {booking.property?.neighborhood || booking.property?.city}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-on-surface-variant">Check-in</p>
              <p className="font-semibold text-on-surface">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Duration</p>
              <p className="font-semibold text-on-surface">{booking.months} month{booking.months > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Total</p>
              <p className="font-bold text-primary">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2 mt-3">
              <img src={getAvatar(booking.tenant)} alt="" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-xs text-on-surface-variant">From <span className="font-semibold text-on-surface">{booking.tenant?.fullName}</span></span>
            </div>
          )}
          {!isOwner && booking.message && (
            <p className="text-xs text-on-surface-variant mt-2 italic">"{booking.message}"</p>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Link to={`/property-details/${booking.property?._id}`}
            className="text-xs font-semibold text-primary hover:underline">View Property →</Link>
          {isOwner && booking.status === 'pending' && (
            <>
              <button onClick={() => handleStatus(booking._id, 'confirmed')}
                className="ml-auto text-xs font-bold bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors">
                Confirm
              </button>
              <button onClick={() => handleStatus(booking._id, 'cancelled')}
                className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors">
                Decline
              </button>
            </>
          )}
          {!isOwner && booking.status === 'pending' && (
            <button onClick={() => handleStatus(booking._id, 'cancelled')}
              className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-200 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">My Bookings</h1>
        <p className="text-on-surface-variant mb-8">Manage your room booking requests.</p>

        <div className="flex gap-2 border-b border-outline-variant/20 mb-8">
          <button onClick={() => setTab('my')}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === 'my' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
            My Requests ({myBookings.length})
          </button>
          <button onClick={() => setTab('received')}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === 'received' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}>
            Received ({received.length})
            {received.filter(b => b.status === 'pending').length > 0 && (
              <span className="ml-2 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full inline-flex items-center justify-center">
                {received.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-surface-container-lowest rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : tab === 'my' ? (
          myBookings.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline-variant">hotel</span>
              <p className="text-on-surface-variant mt-4">No booking requests yet</p>
              <Link to="/find-homes" className="mt-4 inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myBookings.map(b => <BookingCard key={b._id} booking={b} isOwner={false} />)}
            </div>
          )
        ) : (
          received.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline-variant">inbox</span>
              <p className="text-on-surface-variant mt-4">No booking requests received</p>
              <Link to="/create-post" className="mt-4 inline-block bg-primary text-white font-bold px-6 py-3 rounded-full hover:opacity-90">
                List a Property
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {received.map(b => <BookingCard key={b._id} booking={b} isOwner={true} />)}
            </div>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
