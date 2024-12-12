const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

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

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/sample', routes.sample);

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
});

module.exports = app;
