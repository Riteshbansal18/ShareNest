const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const RoommateProfile = require('../models/RoommateProfile');
const Message = require('../models/Message');
const adminProtect = require('../middleware/admin');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const token = generateToken(user._id);
    res.json({
      success: true, token,
      admin: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// All routes below require admin auth
router.use(adminProtect);

router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers, activeUsers, totalProperties, activeProperties,
      totalBookings, pendingBookings, confirmedBookings, cancelledBookings,
      totalRoommates, pendingModeration, recentUsers, recentProperties, recentBookings
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      Property.countDocuments(),
      Property.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      RoommateProfile.countDocuments({ isActive: true }),
      Property.countDocuments({ moderationStatus: 'pending' }),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('fullName email createdAt isActive verificationLevel profileImage'),
      Property.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'fullName').select('title city price verified createdAt isActive moderationStatus'),
      Booking.find().sort({ createdAt: -1 }).limit(5)
        .populate('tenant', 'fullName profileImage')
        .populate('property', 'title city price')
    ]);

    // Revenue estimate (confirmed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // Monthly signups (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: 'user' } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // City distribution
    const cityStats = await Property.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 6 }
    ]);

    // Monthly bookings (last 6 months)
    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, active: activeUsers, inactive: totalUsers - activeUsers },
        properties: { total: totalProperties, active: activeProperties, inactive: totalProperties - activeProperties },
        bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, cancelled: cancelledBookings },
        roommates: { total: totalRoommates },
        revenue: totalRevenue,
        moderation: { pending: pendingModeration }
      },
      charts: { monthlySignups, monthlyBookings, cityStats },
      recent: { users: recentUsers, properties: recentProperties, bookings: recentBookings }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, role = 'user' } = req.query;
    const query = { role };
    if (search) query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.json({ success: true, users, total, pages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const [properties, bookings] = await Promise.all([
      Property.find({ owner: req.params.id }).select('title city price isActive createdAt'),
      Booking.find({ tenant: req.params.id }).populate('property', 'title city').select('status totalAmount createdAt')
    ]);
    res.json({ success: true, user, properties, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id/verify', async (req, res) => {
  try {
    const { level } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { verificationLevel: level }, { new: true });
    res.json({ success: true, message: 'Verification updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Cascade delete — properties, roommate profile, bookings, favorites
    await Promise.all([
      Property.updateMany({ owner: req.params.id }, { isActive: false, moderationStatus: 'rejected' }),
      RoommateProfile.findOneAndUpdate({ user: req.params.id }, { isActive: false }),
    ]);
    res.json({ success: true, message: 'User deleted permanently' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/properties', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, city, status } = req.query;
    const query = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } }
    ];
    if (city) query.city = city;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'verified') query.verified = true;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'fullName email profileImage')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.json({ success: true, properties, total, pages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/properties/:id/verify', async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    res.json({ success: true, message: 'Property verified', property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Set neighborhood safety score
router.patch('/properties/:id/safety', async (req, res) => {
  try {
    const { neighborhoodSafety } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { neighborhoodSafety }, { new: true });
    res.json({ success: true, message: 'Safety score updated', property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/properties/:id/toggle-status', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    property.isActive = !property.isActive;
    await property.save();
    res.json({ success: true, message: `Property ${property.isActive ? 'activated' : 'deactivated'}`, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/properties/:id', async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('tenant', 'fullName email profileImage')
      .populate('owner', 'fullName email')
      .populate('property', 'title city price images')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.json({ success: true, bookings, total, pages: Math.ceil(total / Number(limit)), currentPage: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, message: `Booking ${status}`, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/moderation', async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments({ moderationStatus: status });
    const properties = await Property.find({ moderationStatus: status })
      .populate('owner', 'fullName email profileImage verificationLevel')
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ success: true, properties, total, pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/moderation/:id', async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!['approved', 'rejected'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const property = await Property.findByIdAndUpdate(req.params.id, {
      moderationStatus: status,
      moderationNote: note || '',
      isActive: status === 'approved'
    }, { new: true });

    // Notify property owner
    const { createNotification } = require('../utils/notify');
    await createNotification(req.app, {
      recipient: property.owner,
      type: 'system',
      title: status === 'approved' ? 'Listing Approved ✅' : 'Listing Rejected ❌',
      body: status === 'approved'
        ? `Your listing "${property.title}" is now live!`
        : `Your listing "${property.title}" was rejected. Reason: ${note || 'See dashboard for details'}`,
      link: '/user-dashboard'
    });

    res.json({ success: true, message: `Property ${status}`, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/create-admin', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });
    const admin = await User.create({ fullName, email, password, role: 'admin', isEmailVerified: true, verificationLevel: 3 });
    res.status(201).json({ success: true, message: 'Admin created', admin: { _id: admin._id, fullName: admin.fullName, email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
