const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['pg', 'flat', 'private-room', 'shared-room', 'studio'],
    required: true,
    default: 'pg'
  },
  address: { type: String, required: [true, 'Address is required'] },
  neighborhood: { type: String, trim: true },
  city: { type: String, required: [true, 'City is required'], trim: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  price: {
    type: Number,
    required: [true, 'Rent price is required'],
    min: [0, 'Price cannot be negative']
  },
  deposit: { type: Number, default: 0 },
  roomType: {
    type: String,
    enum: ['Single Room', 'Shared Space', 'Entire Flat', 'Studio'],
    default: 'Single Room'
  },
  bedroomCount: { type: Number, default: 1 },
  bathroomCount: { type: Number, default: 1 },
  amenities: [{ type: String }],
  genderPref: {
    type: String,
    enum: ['Any', 'Male', 'Female', 'Non-binary'],
    default: 'Any'
  },
  images: [{ type: String }],
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  lookingFor: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  moderationNote: { type: String, default: '' },
  availableFrom: { type: Date, default: null },
  isMoveInReady: { type: Boolean, default: false },
  videoTourUrl: { type: String, default: '' },
  neighborhoodSafety: {
    overallScore: { type: Number, default: 0, min: 0, max: 5 },
    safeForWomen: { type: Boolean, default: false },
    metroNearby: { type: Boolean, default: false },
    marketNearby: { type: Boolean, default: false },
    hospitalNearby: { type: Boolean, default: false },
    wellLit: { type: Boolean, default: false },
    lowCrime: { type: Boolean, default: false },
  }
}, { timestamps: true });

// Text index for search
propertySchema.index({ title: 'text', description: 'text', neighborhood: 'text', city: 'text' });
propertySchema.index({ city: 1, price: 1 });
propertySchema.index({ owner: 1 });

module.exports = mongoose.model('Property', propertySchema);
