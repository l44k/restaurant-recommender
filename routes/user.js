const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/User');

// Hae oma profiili + preferenssit
router.get('/me', requireAuth, async (req, res) => {
  res.json(req.user);
});

// Päivitä preferenssit
router.put('/me/preferences', requireAuth, async (req, res) => {
  const { cuisines, dietary, priceLevel, location } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { preferences: { cuisines, dietary, priceLevel, location } },
    { new: true }
  );
  res.json(user.preferences);
});

module.exports = router;