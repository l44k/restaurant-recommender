const router = require('express').Router();
const requireAuth = require('../middleware/requireAuth');
const Review = require('../models/Reviews');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

router.post('/', requireAuth, async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ error: 'Kerro paikkakunta josta haet suosituksia (location)' });
    }

    // Hae käyttäjän KAIKKI arvostelut — nämä kertovat maun
    const reviews = await Review.find({ user: req.user._id })
      .sort({ rating: -1 })
      .limit(15);

    if (reviews.length === 0) {
      return res.status(400).json({
        error: 'Lisää ensin arvosteluja, jotta voin oppia makusi.',
      });
    }

    const preferences = req.user.preferences || {};

    const reviewSummary = reviews
      .map((r) => `- ${r.restaurantName} (${r.cuisine}, ${r.location}): ${r.rating}/5 — "${r.comment || 'ei kommenttia'}"`)
      .join('\n');

    const prompt = `
Olet ravintolasuosittelija. Analysoi käyttäjän makuprofiili hänen arvosteluistaan ja suosittele ravintoloita uudessa kaupungissa.

Ruokavaliorajoitteet: ${preferences.dietary?.join(', ') || 'ei rajoitteita'}
Hintataso (1-4): ${preferences.priceLevel || 'ei asetettu'}

Käyttäjän aiemmat arvostelut (${reviews.length} kpl):
${reviewSummary}

Ohjeet:
- Arvostelun pistemäärällä on merkitystä: 4-5 = käyttäjä rakastaa tätä tyyliä, 3 = ok, 1-2 = käyttäjä ei pidä tästä.
- Suosittele ravintoloita jotka muistuttavat korkealle arvosteltuja, ja vältä matalien arvioiden tyyliä.
- Analysoi ensin lyhyesti käyttäjän makuprofiili.
- Suosittele sitten 3 oikeaa ravintolaa paikkakunnalla ${location}.
- Jokaisesta kerro: nimi, keittiötyyppi, miksi se sopii tälle käyttäjälle, ja arvioitu hintataso.
Vastaa suomeksi.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      searchLocation: location,
      reviewsUsed: reviews.length,
      recommendation: response,
    });
  } catch (err) {
    console.error('Gemini-virhe:', err.message);
    res.status(500).json({ error: 'Suosittelun luonti epäonnistui' });
  }
});

module.exports = router;