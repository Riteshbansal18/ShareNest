import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// User pages
import Home from './pages/Home';
import FindHomes from './pages/FindHomes';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import PropertyDetails from './pages/PropertyDetails';
import RoommateListing from './pages/RoommateListing';
import UserDashboard from './pages/UserDashboard';
import ViewRoommate from './pages/ViewRommate';
import SignUp from './pages/SignUp';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import Bookings from './pages/Bookings';
import ForgotPassword from './pages/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminProperties from './admin/pages/AdminProperties';
import AdminBookings from './admin/pages/AdminBookings';
import AdminSettings from './admin/pages/AdminSettings';
import AdminModeration from './admin/pages/AdminModeration';
import AdminProvider from './admin/AdminProvider';
import { useAdmin } from './admin/AdminContext';

// Providers
import GlobalProvider from './context/GlobalProvider';
import AboutUs from './pages/AboutUs';
import { Toaster } from 'react-hot-toast';
import InstallPrompt from './components/InstallPrompt';
import { CompareProvider } from './components/CompareBar';
import CompareBar from './components/CompareBar';
import BackToTop from './components/BackToTop';

// Must be inside AdminProvider so useAdmin() works
function AppRoutes() {
  const { isAdmin } = useAdmin();

  const AdminRoute = ({ children }) =>
    isAdmin ? <AdminLayout>{children}</AdminLayout> : <Navigate to="/admin/login" replace />;

  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/find-homes" element={<FindHomes />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/property-details" element={<PropertyDetails />} />
      <Route path="/property-details/:id" element={<PropertyDetails />} />
      <Route path="/roommate-listing" element={<RoommateListing />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/view-roommate" element={<ViewRoommate />} />
      <Route path="/view-roommate/:id" element={<ViewRoommate />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/properties" element={<AdminRoute><AdminProperties /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      <Route path="/admin/moderation" element={<AdminRoute><AdminModeration /></AdminRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <AdminProvider>
        <CompareProvider>
          <Toaster position="top-right" />
          <Router>
            <AppRoutes />
          </Router>
          <InstallPrompt />
          <CompareBar />
          <BackToTop />
        </CompareProvider>
      </AdminProvider>
    </GlobalProvider>
  );
}
