const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: [500, 'Review cannot exceed 500 characters'], trim: true },
}, { timestamps: true });

// One review per user per property
reviewSchema.index({ property: 1, reviewer: 1 }, { unique: true });

// Auto-update property averageRating and reviewCount after save/delete
reviewSchema.statics.updatePropertyRating = async function (propertyId) {
  const Property = require('./Property');
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    { $group: { _id: '$property', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, { averageRating: 0, reviewCount: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.updatePropertyRating(this.property);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.updatePropertyRating(doc.property);
});

module.exports = mongoose.model('Review', reviewSchema);
