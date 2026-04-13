const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  preferredCities: [{ type: String }],
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Any'],
    default: 'Any'
  },
  tags: [{ type: String }],
  lookingFor: { type: String, maxlength: [500, 'Looking for text too long'] },
  occupation: { type: String },
  moveInDate: { type: Date },
  leaseDuration: {
    type: String,
    enum: ['1-3 months', '3-6 months', '6-12 months', '1+ year', 'Flexible'],
    default: 'Flexible'
  },
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

roommateProfileSchema.index({ preferredCities: 1, budget: 1 });

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);
