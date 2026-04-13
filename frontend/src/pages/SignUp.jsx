import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { authAPI, googleAuthAPI, otpAPI } from '../api/services';
import { signInWithGoogle } from '../firebase';
import toast from 'react-hot-toast';

export default function SignUp() {
  const { login, updateUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) { toast.error('Please fill in all fields'); return; }
    if (formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      login(res.data.user, res.data.token);
      toast.success('Account created! Check your email for OTP 📧');
      setShowOTP(true);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
    setOtpLoading(true);
    try {
      const res = await otpAPI.verify(otpString);
      updateUser(res.data.user);
      toast.success('Email verified! Welcome to ShareNest 🎉');
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      await otpAPI.resend();
      toast.success('New OTP sent to your email!');
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSkipVerification = () => {
    toast('You can verify your email later from your dashboard', { icon: 'ℹ️' });
    navigate('/user-dashboard');
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const googleUser = await signInWithGoogle();
      const res = await googleAuthAPI.login(googleUser);
      login(res.data.user, res.data.token);
      toast.success('Account created with Google! 🎉');
      navigate('/user-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google sign-up failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // OTP Modal
  if (showOTP) {
    return (
      <>
        <Navbar />
        <main className="flex items-center justify-center min-h-screen px-6 pt-24 pb-12 bg-surface">
          <div className="w-full max-w-md">
            <div className="bg-surface-container-lowest rounded-2xl p-10 shadow-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
              </div>
              <h2 className="text-3xl font-extrabold text-primary mb-2">Check your email</h2>
              <p className="text-on-surface-variant mb-1">We sent a 6-digit OTP to</p>
              <p className="font-bold text-on-surface mb-8">{formData.email}</p>

              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-surface-container-highest rounded-xl border-2 border-transparent focus:border-primary focus:outline-none text-on-surface transition-all"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={otpLoading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
              >
                {otpLoading
                  ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Verifying...</>
                  : 'Verify Email'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  className="text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
                <button onClick={handleSkipVerification} className="text-outline hover:text-on-surface transition-colors">
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-stretch min-h-screen">
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
          <img alt="The Curated Sanctuary" className="absolute inset-0 h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApP0VEN40pasGxHG4qTSOeZiZ1qRcV7ureFnDWHV8xQhD5f4Nc898DZ5WqJtvHOV6zdQcJbOheaWr_nd77GHcMM1W47Wg3VkOYRjMQemck3MFsFFEd7KB1U0kbYxS7yThP-QU6jKoMfHlA0ggSbPBDXBgLH00eE64OW0zF-J9_gAMQxeXavPrgOzl3DxfPwcSsxplrelObbj2QAF5q9ZC992FyQowKI4QNII6YazArkGGE78BcHHd_qjru03el0NEmxrlcgkOg36wP"
          />
          <div className="relative z-20 flex flex-col justify-end p-20 w-full text-white">
            <div className="max-w-md">
              <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Find your place in the world.</h2>
              <p className="text-lg text-white/90 font-body leading-relaxed">Experience a curated journey to discovering your perfect home and the ideal roommate to share it with.</p>
            </div>
          </div>
        </section>
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-surface pt-32 lg:pt-24">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-2">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase">Begin Your Journey</span>
              <h1 className="text-4xl font-extrabold text-primary tracking-tight">Create Account</h1>
              <p className="text-on-surface-variant text-sm">Join the curated sanctuary for modern living.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">person</span>
                    <input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body"
                      placeholder="Your full name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">alternate_email</span>
                    <input className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body"
                      placeholder="name@example.com" type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-on-surface-variant font-label ml-1">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">lock</span>
                    <input className="w-full pl-12 pr-12 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/60 text-on-surface font-body"
                      placeholder="••••••••" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                      <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-outline ml-1">Must be at least 8 characters.</p>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-bold py-5 rounded-full shadow-lg shadow-primary/10 hover:opacity-90 active:scale-[0.98] transition-all text-base tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Creating account...</>
                  : 'Create Account'}
              </button>
            </form>
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
              <span className="text-xs font-bold text-outline font-label">OR CONTINUE WITH</span>
              <div className="flex-grow h-[1px] bg-outline-variant/30"></div>
            </div>
            <button onClick={handleGoogleSignUp} disabled={googleLoading}
              className="flex items-center justify-center gap-3 w-full py-4 bg-surface-container-lowest text-on-surface border border-outline-variant/20 rounded-full font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm disabled:opacity-60">
              {googleLoading
                ? <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
                : <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
              }
              {googleLoading ? 'Signing up...' : 'Sign up with Google'}
            </button>
            <p className="text-center text-sm text-outline-variant px-4">
              By creating an account, you agree to our{' '}
              <Link className="text-on-surface-variant font-bold hover:text-primary underline decoration-primary/20" to="/terms">Terms of Service</Link>{' '}
              and{' '}
              <Link className="text-on-surface-variant font-bold hover:text-primary underline decoration-primary/20" to="/privacy">Privacy Policy</Link>.
            </p>
            <p className="text-center text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link className="text-primary font-bold hover:underline" to="/login">Sign In</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
