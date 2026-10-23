const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const Review = require('../models/Reviews');

// Hae kaikki omat arvostelut
router.get('/', requireAuth, async (req, res) => {
  const reviews = await Review.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// Hae yksittäinen arvostelu
router.get('/:id', requireAuth, async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).json({ error: 'Arvostelua ei löytynyt' });
  res.json(review);
});

// Luo uusi arvostelu
router.post('/', requireAuth, async (req, res) => {
  const { restaurantName, cuisine, rating, comment, location } = req.body;
  const review = await Review.create({
    user: req.user._id,
    restaurantName,
    cuisine,
    rating,
    comment,
    location,
  });
  res.status(201).json(review);
});

// Päivitä arvostelu
router.put('/:id', requireAuth, async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!review) return res.status(404).json({ error: 'Arvostelua ei löytynyt' });
  res.json(review);
});

// Poista arvostelu
router.delete('/:id', requireAuth, async (req, res) => {
  const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!review) return res.status(404).json({ error: 'Arvostelua ei löytynyt' });
  res.json({ message: 'Arvostelu poistettu' });
});

module.exports = router;