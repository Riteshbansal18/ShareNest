const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null
  },
  roommate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: ['property', 'roommate'],
    required: true
  }
}, { timestamps: true });

favoriteSchema.index({ user: 1, type: 1 });
favoriteSchema.index({ user: 1, property: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ user: 1, roommate: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
