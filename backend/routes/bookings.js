const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');
const { createNotification } = require('../utils/notify');

router.post('/', protect, async (req, res) => {
  try {
    const { propertyId, checkIn, months, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property' });
    }

    // Check for existing active booking
    const existing = await Booking.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active booking for this property' });
    }

    const numMonths = Number(months) || 1;
    const totalAmount = property.price * numMonths;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setMonth(checkOutDate.getMonth() + numMonths);

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      months: numMonths,
      totalAmount,
      message: message || ''
    });

    await booking.populate([
      { path: 'property', select: 'title price neighborhood city images' },
      { path: 'tenant', select: 'fullName email profileImage' },
      { path: 'owner', select: 'fullName email profileImage' }
    ]);

    res.status(201).json({ success: true, message: 'Booking request sent!', booking });

    // Notify property owner
    await createNotification(req.app, {
      recipient: property.owner,
      type: 'booking_request',
      title: 'New Booking Request',
      body: `${booking.tenant.fullName} wants to book "${property.title}"`,
      link: '/bookings'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title price neighborhood city images address')
      .populate('owner', 'fullName profileImage phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/received', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title price neighborhood city images')
      .populate('tenant', 'fullName profileImage email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.owner.toString() !== req.user._id.toString() &&
        booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // Notify tenant about status update
    await booking.populate([{ path: 'property', select: 'title' }, { path: 'tenant', select: 'fullName' }]);
    await createNotification(req.app, {
      recipient: booking.tenant._id || booking.tenant,
      type: 'booking_update',
      title: `Booking ${status === 'confirmed' ? 'Confirmed ✅' : 'Cancelled ❌'}`,
      body: `Your booking for "${booking.property?.title}" has been ${status}`,
      link: '/bookings'
    });

    res.json({ success: true, message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
