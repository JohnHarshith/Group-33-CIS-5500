const express = require('express');
const bodyParser = require('body-parser')
const bodyParser = require('body-parser'); // To parse JSON payloads
const cors = require('cors');
const routes = require('./routes'); // Ensure this path is correct
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();
 
// create application/json parser
const jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
}));

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));

// Simple
app.get('/top-reviewed-restaurants', routes.topReviewRestaurants);
app.get('/average-stars-wifi', routes.averageStarsWifi);
app.get('/most-favorited-restaurants', routes.mostFavouriteRestaurants);
app.get('/total-checkins-by-weekday', routes.totalCheckinsWeekday);
app.get('/review-photos/:reviewId', routes.reviewPhotos); //Populate photos table
app.get('/top-categories', routes.topCategories);
app.get('/most-tipped-restaurants', routes.mostTippedRestaurants);
app.get('/cities-outdoor-seating', routes.citiesWithOutdoorSeating);
app.get('/most-helpful-reviews', routes.mostHelpfulReviews); //Running in infinite loop?
app.get('/average-checkins', routes.averageCheckins);

// Complex
app.get('/top-cities-diverse-high-rated-restaurants', routes.topCitiesDiverseHighRated);
app.get('/top-restaurants-reviewed-by-user-friends', routes.topRestaurantsReviewedByUserFriends)
app.get('/monthly-checkin-distribution', routes.monthlyCheckinDistribution); // Query wrong?
app.get('/happiest-city', routes.happiestCity);

//Additional
app.get('/restaurants-open-now', routes.openRestaurantsNow);
app.get('/restaurants-with-amenities', routes.restaurantsWithAmenities);
app.post('/add-review', routes.addReview);
app.post('/add-checkin', routes.addCheckin);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)

// Middleware to handle JSON payloads
app.use(bodyParser.json());

// Define API endpoints
app.get('/sample', routes.sample); // Sample endpoint
app.post('/register', routes.registerUser); // Endpoint for user registration
app.post('/logout', routes.logoutUser); // Endpoint for user logout

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

// Export the app for external usage/testing
module.exports = app;