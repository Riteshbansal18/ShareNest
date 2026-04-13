const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { type } = req.query;
    const query = { user: req.user._id };
    if (type) query.type = type;

    const favorites = await Favorite.find(query)
      .populate({
        path: 'property',
        select: 'title price neighborhood city images roomType genderPref verified',
        populate: { path: 'owner', select: 'fullName profileImage' }
      })
      .populate({
        path: 'roommate',
        select: 'fullName profileImage verificationLevel location'
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/property/:propertyId', protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
      type: 'property'
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }

    await Favorite.create({
      user: req.user._id,
      property: req.params.propertyId,
      type: 'property'
    });

    res.status(201).json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/roommate/:roommateId', protect, async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      roommate: req.params.roommateId,
      type: 'roommate'
    });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ success: true, favorited: false, message: 'Removed from favorites' });
    }

    await Favorite.create({
      user: req.user._id,
      roommate: req.params.roommateId,
      type: 'roommate'
    });

    res.status(201).json({ success: true, favorited: true, message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/check/property/:propertyId', protect, async (req, res) => {
  try {
    const fav = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
      type: 'property'
    });
    res.json({ success: true, favorited: !!fav });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
