const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const { sendOTPEmail } = require('../utils/emailService');
const crypto = require('crypto');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ fullName, email, password });
    const token = generateToken(user._id);

    // Send OTP for email verification
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await User.findByIdAndUpdate(user._id, { emailOTP: otp, emailOTPExpiry: otpExpiry });

    try {
      await sendOTPEmail(email, otp, fullName);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Account created! Please verify your email.',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        verificationLevel: user.verificationLevel,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' });
    }

    user.lastSeen = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        verificationLevel: user.verificationLevel,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { fullName, email, profileImage, googleId } = req.body;
    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: 'Invalid Google credentials' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // New user — create without password
      const crypto = require('crypto');
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await User.create({
        fullName: fullName || email.split('@')[0],
        email,
        password: randomPassword,
        profileImage: profileImage || '',
        googleId,
        isEmailVerified: true,
        verificationLevel: 1
      });
    } else {
      // Existing user — update googleId and profile image if missing
      if (!user.googleId) user.googleId = googleId;
      if (!user.profileImage && profileImage) user.profileImage = profileImage;
      user.lastSeen = new Date();
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        verificationLevel: user.verificationLevel,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/verify-otp', protect, async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ success: false, message: 'OTP is required' });

    const user = await User.findById(req.user._id).select('+emailOTP +emailOTPExpiry');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email already verified' });
    if (!user.emailOTP || user.emailOTP !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.emailOTPExpiry < new Date())
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });

    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      verificationLevel: Math.max(user.verificationLevel, 1),
      emailOTP: null,
      emailOTPExpiry: null
    });

    const updatedUser = await User.findById(user._id);
    res.json({ success: true, message: 'Email verified successfully! 🎉', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/resend-otp', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, { emailOTP: otp, emailOTPExpiry: otpExpiry });

    await sendOTPEmail(user.email, otp, user.fullName);
    res.json({ success: true, message: 'OTP resent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, message: 'If this email exists, an OTP has been sent.' });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await User.findByIdAndUpdate(user._id, { emailOTP: otp, emailOTPExpiry: expiry });

    try {
      await sendOTPEmail(email, otp, user.fullName, true);
    } catch (e) { console.error('Reset email failed:', e.message); }

    res.json({ success: true, message: 'If this email exists, an OTP has been sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ success: false, message: 'Email, OTP and new password are required' });
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+emailOTP +emailOTPExpiry');
    if (!user) return res.status(400).json({ success: false, message: 'Invalid request' });
    if (!user.emailOTP || user.emailOTP !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    if (user.emailOTPExpiry < new Date())
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });

    user.password = newPassword;
    user.emailOTP = null;
    user.emailOTPExpiry = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
