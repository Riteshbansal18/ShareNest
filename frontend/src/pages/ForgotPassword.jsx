import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { passwordAPI } from '../api/services';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Step 1 — Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await passwordAPI.forgot(email);
      toast.success('OTP sent! Check your email 📧');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`reset-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
  };

  // Step 2 — Verify OTP + Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
    if (!newPassword || newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await passwordAPI.reset(email, otpString, newPassword);
      toast.success('Password reset successfully! 🎉');
      setStep('done');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await passwordAPI.forgot(email);
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen px-6 pt-24 pb-12 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-container/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-container/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md z-10">
          <div className="bg-surface-container-lowest rounded-2xl p-8 md:p-10 shadow-lg">

            {/* Step 1 — Email */}
            {step === 'email' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-primary">Forgot Password?</h1>
                  <p className="text-on-surface-variant mt-2 text-sm">Enter your email and we'll send you a reset OTP.</p>
                </div>
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        placeholder="name@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending OTP...</>
                      : <><span className="material-symbols-outlined text-sm">send</span> Send OTP</>}
                  </button>
                </form>
                <p className="text-center text-sm text-on-surface-variant mt-6">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>
              </>
            )}

            {/* Step 2 — OTP + New Password */}
            {step === 'otp' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-3xl">mark_email_unread</span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-primary">Check your email</h1>
                  <p className="text-on-surface-variant mt-1 text-sm">OTP sent to <span className="font-bold text-on-surface">{email}</span></p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                  {/* OTP inputs */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-3 text-center">Enter 6-digit OTP</label>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, i) => (
                        <input key={i} id={`reset-otp-${i}`} type="text" inputMode="numeric"
                          maxLength={1} value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          className="w-11 h-13 text-center text-xl font-bold bg-surface-container-highest rounded-xl border-2 border-transparent focus:border-primary focus:outline-none text-on-surface transition-all py-3" />
                      ))}
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">New Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                      <input type={showPassword ? 'text' : 'password'} value={newPassword}
                        onChange={e => setNewPassword(e.target.value)} required placeholder="Min 8 characters"
                        className="w-full pl-12 pr-12 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary">
                        <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2">Confirm Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} required placeholder="Re-enter password"
                        className="w-full pl-12 pr-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface" />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading
                      ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Resetting...</>
                      : 'Reset Password'}
                  </button>
                </form>

                <div className="flex items-center justify-between mt-5 text-sm">
                  <button onClick={handleResend} disabled={resendLoading}
                    className="text-primary font-semibold hover:underline disabled:opacity-50">
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                  <button onClick={() => setStep('email')} className="text-outline hover:text-on-surface transition-colors">
                    Change email
                  </button>
                </div>
              </>
            )}

            {/* Step 3 — Done */}
            {step === 'done' && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-green-600 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="text-2xl font-extrabold text-on-surface mb-2">Password Reset!</h2>
                <p className="text-on-surface-variant text-sm mb-8">Your password has been updated successfully. You can now sign in with your new password.</p>
                <Link to="/login"
                  className="block w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-full hover:opacity-90 transition-all text-center">
                  Go to Sign In
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
