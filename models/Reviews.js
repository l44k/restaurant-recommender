const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantName: {
      type: String,
      required: [true, 'Ravintolan nimi on pakollinen'],
    },
    cuisine: {
      type: String,      // esim. "japanilainen"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    location: {
      type: String,         // esim. "Helsinki, Kamppi"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);