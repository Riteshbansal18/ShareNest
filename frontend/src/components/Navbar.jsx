import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, notifications, unreadCount, markAllRead, deleteNotification, darkMode, toggleDarkMode } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/'); };

  const avatarUrl = user?.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=1e3a5f&color=fff`;

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = (notif) => {
    if (!notif.isRead) deleteNotification(notif._id);
    if (notif.link) navigate(notif.link);
    setNotifOpen(false);
  };

  const notifIcon = { message: 'chat_bubble', booking_request: 'hotel', booking_update: 'event_available', review: 'star', system: 'info' };

  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-transparent dark:border-slate-800">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
        <Link to="/"><div className="text-2xl font-black tracking-tight text-blue-900">ShareNest</div></Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/find-homes">Find Homes</Link>
          <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/roommate-listing">Find Roommates</Link>
          <Link className="text-slate-600 hover:text-blue-800 transition-all duration-300 font-body body-md" to="/create-post">List Property</Link>
        </nav>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* Messages — visible on mobile too */}
              <Link to="/messages" className="text-slate-500 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-slate-100 relative flex">
                <span className="material-symbols-outlined">chat_bubble</span>
              </Link>

              {/* Notification Bell — visible on mobile too */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen && unreadCount > 0) markAllRead(); }}
                  className="text-slate-500 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-slate-100 relative">
                  <span className="material-symbols-outlined">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="font-bold text-slate-800">Notifications</span>
                      {notifications.length > 0 && (
                        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm">
                          <span className="material-symbols-outlined text-3xl block mb-2">notifications_none</span>
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif._id}
                            onClick={() => handleNotifClick(notif)}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!notif.isRead ? 'bg-blue-100' : 'bg-slate-100'}`}>
                              <span className={`material-symbols-outlined text-sm ${!notif.isRead ? 'text-blue-600' : 'text-slate-400'}`}>
                                {notifIcon[notif.type] || 'info'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{notif.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">{notif.body}</p>
                              <p className="text-xs text-slate-300 mt-1">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            {!notif.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown — desktop only */}
              <div className="relative hidden sm:block">
                <button onClick={() => setMenuOpen(!menuOpen)}
                  className="hidden sm:flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <img src={avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                  <span className="text-sm font-semibold text-slate-700">{user?.fullName?.split(' ')[0]}</span>
                  <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <Link to="/user-dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm">
                      <span className="material-symbols-outlined text-sm">person</span> My Dashboard
                    </Link>
                    <Link to="/create-post" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm">
                      <span className="material-symbols-outlined text-sm">add_home</span> List Property
                    </Link>
                    <Link to="/messages" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span> Messages
                    </Link>
                    <Link to="/bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm">
                      <span className="material-symbols-outlined text-sm">hotel</span> My Bookings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm w-full text-left">
                      <span className="material-symbols-outlined text-sm">logout</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><button className="text-blue-900 font-semibold px-4 py-2 hover:bg-slate-100 transition-all duration-300 rounded-full">Sign In</button></Link>
              <Link to="/sign-up"><button className="primary-gradient text-white font-bold px-6 py-2.5 rounded-full hover:scale-95 transition-all duration-200 shadow-md hidden sm:block">Sign Up</button></Link>
            </>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>

          {/* Dark mode toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle dark mode">
            <span className="material-symbols-outlined text-slate-500" style={{ fontVariationSettings: "'FILL' 1" }}>
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          <Link to="/find-homes" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">Find Homes</Link>
          <Link to="/roommate-listing" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">Find Roommates</Link>
          <Link to="/create-post" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">List Property</Link>
          {isAuthenticated ? (
            <>
              <Link to="/user-dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">Dashboard</Link>
              <Link to="/messages" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">Messages</Link>
              <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block py-2 text-slate-700 font-medium">My Bookings</Link>
              <button onClick={handleLogout} className="block py-2 text-red-600 font-medium w-full text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-blue-900 font-semibold">Sign In</Link>
              <Link to="/sign-up" onClick={() => setMobileOpen(false)} className="block py-2 text-blue-900 font-bold">Sign Up</Link>
            </>
          )}
        </div>
      )}

      {menuOpen && <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
