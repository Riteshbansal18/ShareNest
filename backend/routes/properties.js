const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Review = require('../models/Review');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { compressAndSave } = require('../middleware/upload');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      city, minPrice, maxPrice, genderPref, roomType, amenities,
      category, search, sort = 'newest', page = 1, limit = 12
    } = req.query;

    const query = { isActive: true, moderationStatus: 'approved' };

    if (city) query.city = { $regex: city, $options: 'i' };
    if (genderPref && genderPref !== 'Any') query.genderPref = genderPref;
    if (roomType) query.roomType = roomType;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 }
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'fullName profileImage verificationLevel')
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'fullName profileImage verificationLevel location createdAt');

    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment view count
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, upload.array('images', 10), compressAndSave('property'), async (req, res) => {
  try {
    const {
      title, description, category, address, neighborhood, city,
      price, deposit, roomType, bedroomCount, bathroomCount,
      amenities, genderPref, lookingFor
    } = req.body;

    const images = req.files ? req.files.map(f => `/uploads/images/${f.filename}`) : [];

    const property = await Property.create({
      owner: req.user._id,
      title, description, category, address, neighborhood, city,
      price: Number(price),
      deposit: Number(deposit) || 0,
      roomType, bedroomCount, bathroomCount,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',')) : [],
      genderPref: genderPref || 'Any',
      lookingFor: lookingFor ? (Array.isArray(lookingFor) ? lookingFor : lookingFor.split(',')) : [],
      images
    });

    await property.populate('owner', 'fullName profileImage verificationLevel');

    res.status(201).json({ success: true, message: 'Property listed successfully', property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, upload.array('images', 10), compressAndSave('property'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(f => `/uploads/images/${f.filename}`);
    }
    if (updates.amenities && !Array.isArray(updates.amenities)) {
      updates.amenities = updates.amenities.split(',');
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    }).populate('owner', 'fullName profileImage verificationLevel');

    res.json({ success: true, message: 'Property updated', property: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Property.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/user/my-listings', protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate('reviewer', 'fullName profileImage verificationLevel')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (property.owner.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'You cannot review your own property' });

    const existing = await Review.findOne({ property: req.params.id, reviewer: req.user._id });
    if (existing)
      return res.status(400).json({ success: false, message: 'You have already reviewed this property' });

    const review = await Review.create({ property: req.params.id, reviewer: req.user._id, rating, comment });
    await review.populate('reviewer', 'fullName profileImage verificationLevel');

    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id/reviews/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.reviewer.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
