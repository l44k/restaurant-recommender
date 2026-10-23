const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: [true, 'Google ID is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    
    preferences: {
      cuisines: [String],        // esim. ["japanilainen", "italialainen"]
      dietary: [String],         // esim. ["vegaani", "gluteeniton"]
      priceLevel: Number,        // 1 = halpa, 4 = kallis
      location: String,          // esim. "Helsinki"
    },
  },

);


module.exports = mongoose.models.User || mongoose.model('User', userSchema);