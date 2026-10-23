require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport');

const authRouter = require('./routes/auth');

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB yhdistetty'))
  .catch((err) => console.error('MongoDB virhe:', err.message));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/user', require('./routes/user'));
app.get('/', (req, res) => {
  if (req.user) {
    res.json({ message: `Tervetuloa ${req.user.name}`, user: req.user });
  } else {
    res.json({ message: 'Kirjaudu sisään: /auth/google' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});