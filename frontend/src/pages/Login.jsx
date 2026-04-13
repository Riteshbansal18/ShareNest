import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';import { GlobalContext } from '../context/GlobalContext';
import { useAdmin } from '../admin/AdminContext';
import { authAPI, googleAuthAPI } from '../api/services';
import { signInWithGoogle } from '../firebase';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useContext(GlobalContext);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      if (res.data.user.role === 'admin') {
        // Admin login — store in admin context and go to admin dashboard
        adminLogin(res.data.user, res.data.token);
        toast.success(`Welcome, Admin ${res.data.user.fullName.split(' ')[0]}! 🔐`);
        navigate('/admin/dashboard');
      } else {
        // Normal user login
        login(res.data.user, res.data.token);
        toast.success(`Welcome back, ${res.data.user.fullName.split(' ')[0]}!`);
        navigate('/user-dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      const res = await googleAuthAPI.login(googleUser);
      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.fullName.split(' ')[0]}!`);
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 py-12 pt-32 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="w-full max-w-md z-10">
          <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-[0_12px_32px_rgba(24,28,32,0.06)]">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-3">Welcome Back</h1>
              <p className="text-on-surface-variant font-body">Enter your credentials to access your sanctuary.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-on-surface-variant font-label" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
                    id="email" name="email" placeholder="name@example.com" required type="email"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-on-surface-variant font-label" htmlFor="password">Password</label>
                  <button type="button" className="text-sm font-semibold text-secondary hover:text-primary transition-colors" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input
                    className="w-full pl-12 pr-12 py-3 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
                    id="password" name="password" placeholder="••••••••" required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password} onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                    <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-high"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-outline font-medium">Or continue with</span>
              </div>
            </div>
            <button onClick={handleGoogleLogin} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low border border-outline-variant/15 rounded-full hover:bg-surface-container-high transition-colors group disabled:opacity-60">
              {googleLoading
                ? <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
                : <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
              }
              <span className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </button>
            <div className="mt-10 text-center">
              <p className="text-on-surface-variant font-medium">
                Don't have an account?
                <Link className="text-primary font-bold hover:underline underline-offset-4 ml-1 transition-all" to="/sign-up">Create Account</Link>
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 text-on-tertiary-container bg-tertiary-fixed/30 py-2 px-4 rounded-full w-fit mx-auto">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-xs font-bold tracking-wide">SECURE ENCRYPTED ACCESS</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
