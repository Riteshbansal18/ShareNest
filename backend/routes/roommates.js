const express = require('express');
const router = express.Router();
const RoommateProfile = require('../models/RoommateProfile');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { city, minBudget, maxBudget, gender, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (city && city !== 'All Cities') {
      query.preferredCities = { $in: [new RegExp(city, 'i')] };
    }
    if (gender && gender !== 'Any Gender') query.gender = gender;
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await RoommateProfile.countDocuments(query);

    const profiles = await RoommateProfile.find(query)
      .populate('user', 'fullName profileImage verificationLevel location interests')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    let myProfile = null;
    if (req.user) myProfile = await RoommateProfile.findOne({ user: req.user._id });

    const roommates = profiles.map(profile => {
      let compatibilityScore = null;
      if (myProfile && myProfile.user.toString() !== profile.user._id.toString()) {
        let score = 0;
        const cityOverlap = myProfile.preferredCities.filter(c => profile.preferredCities.includes(c));
        if (cityOverlap.length > 0) score += 40;
        const budgetDiff = Math.abs(myProfile.budget - profile.budget) / Math.max(myProfile.budget, profile.budget);
        if (budgetDiff <= 0.3) score += 30;
        const tagOverlap = myProfile.tags.filter(t => profile.tags.includes(t));
        score += Math.min(20, tagOverlap.length * 5);
        if (myProfile.leaseDuration === profile.leaseDuration) score += 10;
        compatibilityScore = score;
      }
      return { ...profile.toObject(), compatibilityScore };
    });

    res.json({
      success: true,
      count: profiles.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      roommates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/my/profile', protect, async (req, res) => {
  try {
    const profile = await RoommateProfile.findOne({ user: req.user._id })
      .populate('user', 'fullName profileImage verificationLevel location interests bio occupation gender');
    res.json({ success: true, roommate: profile || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const profile = await RoommateProfile.findById(req.params.id)
      .populate('user', 'fullName profileImage verificationLevel location interests bio occupation gender');

    if (!profile || !profile.isActive) {
      return res.status(404).json({ success: false, message: 'Roommate profile not found' });
    }

    // Calculate compatibility score if logged in
    let compatibilityScore = null;
    if (req.user) {
      const myProfile = await RoommateProfile.findOne({ user: req.user._id });
      if (myProfile) {
        let score = 0;
        // City match (40 pts)
        const cityOverlap = myProfile.preferredCities.filter(c => profile.preferredCities.includes(c));
        if (cityOverlap.length > 0) score += 40;
        // Budget within 30% range (30 pts)
        const budgetDiff = Math.abs(myProfile.budget - profile.budget) / Math.max(myProfile.budget, profile.budget);
        if (budgetDiff <= 0.3) score += 30;
        // Tags overlap (20 pts)
        const tagOverlap = myProfile.tags.filter(t => profile.tags.includes(t));
        score += Math.min(20, tagOverlap.length * 5);
        // Lease duration match (10 pts)
        if (myProfile.leaseDuration === profile.leaseDuration) score += 10;
        compatibilityScore = score;
      }
    }

    res.json({ success: true, roommate: profile, compatibilityScore });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { budget, preferredCities, gender, tags, lookingFor, occupation, moveInDate, leaseDuration } = req.body;

    let profile = await RoommateProfile.findOne({ user: req.user._id });

    if (profile) {
      profile = await RoommateProfile.findOneAndUpdate(
        { user: req.user._id },
        { budget, preferredCities, gender, tags, lookingFor, occupation, moveInDate, leaseDuration, isActive: true },
        { new: true, runValidators: true }
      ).populate('user', 'fullName profileImage verificationLevel');

      return res.json({ success: true, message: 'Profile updated', roommate: profile });
    }

    profile = await RoommateProfile.create({
      user: req.user._id,
      budget, preferredCities, gender, tags, lookingFor, occupation, moveInDate, leaseDuration, isActive: true
    });

    await profile.populate('user', 'fullName profileImage verificationLevel');

    res.status(201).json({ success: true, message: 'Roommate profile created', roommate: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/my-profile', protect, async (req, res) => {
  try {
    await RoommateProfile.findOneAndUpdate({ user: req.user._id }, { isActive: false });
    res.json({ success: true, message: 'Roommate profile deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
