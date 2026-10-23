# Restaurant Recommender

A REST API that recommends restaurants based on your own taste. You sign in with Google, rate restaurants you have visited and set your preferences. Google Gemini then analyses your taste profile and recommends restaurants in another city.

Built as the final project of a Node.js backend course at JAMK University of Applied Sciences.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-8E75B2?style=flat&logo=googlegemini&logoColor=white)

## How it works

1. Sign in with your Google account.
2. Add reviews of restaurants you know (rating 1–5, cuisine, location, comment).
3. Optionally set preferences: dietary restrictions and price level.
4. Ask for recommendations in a city. Your 15 highest-rated reviews and your preferences go into a prompt, and Gemini replies with a short analysis of your taste and three restaurant suggestions, each with the reason it fits you.

The prompt tells Gemini to treat ratings of 4–5 as styles you love and 1–2 as styles to avoid. The app's messages and Gemini's answers are in Finnish.

## Tech stack

- **Node.js + Express 5**: REST API
- **MongoDB Atlas + Mongoose**: users and reviews
- **Passport.js (Google OAuth 2.0) + express-session**: sign-in
- **Google Gemini API** (`gemini-2.5-flash-lite`): recommendations

## Getting started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/restaurant-recommender
   SESSION_SECRET=<any-long-random-string>
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   GEMINI_API_KEY=<your-gemini-key>
   ```

   Where to get the keys:
   - **MongoDB Atlas:** https://cloud.mongodb.com (the free M0 cluster is enough)
   - **Google OAuth:** https://console.cloud.google.com → APIs & Services → Credentials → OAuth 2.0 Client ID. Set the callback URL to `http://localhost:3000/auth/google/callback`.
   - **Gemini API:** https://aistudio.google.com/apikey

3. Start the server:

   ```bash
   npm start        # or: npm run dev (with nodemon)
   ```

## Trying it out

1. Open `http://localhost:3000/auth/google` and sign in.
2. Open the browser console (F12 → Console) on `http://localhost:3000` and run:

**Set preferences**

```javascript
fetch('/api/user/me/preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cuisines: ['japanese', 'italian'], dietary: [], priceLevel: 3, location: 'Helsinki' }) }).then(r => r.json()).then(console.log)
```

**Add a review**

```javascript
fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ restaurantName: 'Ramen-ya', cuisine: 'japanese', rating: 5, comment: 'Best ramen in town', location: 'Helsinki' }) }).then(r => r.json()).then(console.log)
```

**Get recommendations**

```javascript
fetch('/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'Oulu' }) }).then(r => r.json()).then(console.log)
```

## API

All `/api` routes require a signed-in user.

| Method | Route | Description |
| --- | --- | --- |
| GET | `/auth/google` | Sign in with Google |
| GET | `/auth/logout` | Sign out |
| GET | `/api/user/me` | Your profile |
| PUT | `/api/user/me/preferences` | Update your preferences |
| GET | `/api/reviews` | Your reviews |
| GET | `/api/reviews/:id` | One review |
| POST | `/api/reviews` | Add a review |
| PUT | `/api/reviews/:id` | Edit a review |
| DELETE | `/api/reviews/:id` | Delete a review |
| POST | `/api/recommend` | Get recommendations from Gemini |

## Project structure

```
config/passport.js        Google OAuth strategy and session handling
middleware/requireAuth.js Blocks routes for signed-out users
models/                   Mongoose models: User (with preferences) and Review
routes/                   auth, reviews, user and recommend routes
server.js                 Express app
```

## How it was built

- The idea and the prompt design are my own.
- Google sign-in was built on the course material.
- The review CRUD and the Gemini integration were built with AI assistance (Claude).

## Author

Joona Järvi · [LinkedIn](https://www.linkedin.com/in/joonaj%C3%A4rvi)

## License

[MIT](LICENSE)
