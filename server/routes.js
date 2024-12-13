const express = require('express');
const { Pool, types } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); 
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

// Initialize express router
const router = express.Router();

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10));

// Create PostgreSQL connection using environment variables
const connection = new Pool({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// Define routes
const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a unique user_id
    const userId = uuidv4();

    // Insert user into the database
    const query = `
      INSERT INTO users (user_id, email, username, password_hash, registration_date)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING user_id, email, username, registration_date;
    `;
    const values = [userId, email, username, passwordHash];
    const result = await connection.query(query, values);

    // Respond with the new user's data (excluding the password hash)
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error.message, error.stack);
    if (error.code === '23505') {
      // Email already exists
      res.status(409).json({ error: 'Email already in use.' });
    } else {
      res.status(500).json({ error: 'Failed to register user.' });
    }
  }
};

const logoutUser = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING last_login;
    `;
    const result = await connection.query(query, [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Logout successful.', lastLogin: result.rows[0].last_login });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to log out user.' });
  }
};

const checkUsername = async (req, res) => {
  console.log('Check username called with:', req.body);

  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const query = 'SELECT COUNT(*) FROM users WHERE username = $3';
    const result = await connection.query(query, [username]);
    const exists = parseInt(result.rows[0].count, 10) > 0;
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Failed to check username.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if the user exists
    const query = `
      SELECT user_id, email, username, password_hash
      FROM users
      WHERE email = $1;
    `;
    const result = await connection.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate a session token (or JWT)
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Adjust expiration as needed
    );

    // Optionally update the last login time in the database
    const updateQuery = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE user_id = $1;
    `;
    await connection.query(updateQuery, [user.user_id]);

    // Respond with the session token and user data
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to log in user.' });
  }
};

const getUniqueCities = async (req, res) => {
  try {
    // Query to fetch all unique cities from the business_locations table
    const query = `
      SELECT DISTINCT city
      FROM business_locations
      ORDER BY city;
    `;
    const result = await connection.query(query);

    // Extract cities from the query result
    const cities = result.rows.map(row => row.city);

    res.status(200).json({ cities });
  } catch (error) {
    console.error('Error fetching unique cities:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch unique cities.' });
  }
};

const getUniqueCuisine = async (req, res) => {
  try {
    // Query to fetch all unique cities from the business_locations table
    const query = `
      SELECT DISTINCT cuisine
      FROM normalized_businesses
      ORDER BY cuisine;
    `;
    const result = await connection.query(query);

    const cuisines = result.rows.map(row => row.cuisine);

    res.status(200).json({ cuisines });
  } catch (error) {
    console.error('Error fetching unique cuisines:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch unique cuisines.' });
  }
};

const getRestaurants = async (req, res) => {
  try {
    // Get current EST timestamp
    const now = new Date();
    const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const currentDay = estTime.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Monday"
    const currentTime = estTime.toTimeString().slice(0, 8); // HH:MM:SS format

    // Get pagination parameters from query string
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Query to fetch all restaurant details by joining the required tables
    const query = `
      SELECT 
        nb.business_id,
        nb.name,
        nb.stars,
        nb.review_count,
        nb.categories,
        nb.cuisine,
        bl.city,
        json_agg(
          json_build_object(
            'day_of_week', nbh.day_of_week,
            'open_time', nbh.open_time,
            'close_time', nbh.close_time
          ) ORDER BY nbh.day_of_week
        ) AS hours
      FROM 
        normalized_businesses nb
      JOIN 
        business_locations bl
      ON 
        nb.location_id = bl.location_id
      JOIN 
        normalized_business_hours nbh
      ON 
        nb.business_id = nbh.business_id
      WHERE 
        nb.categories ILIKE '%Restaurants%'
      GROUP BY 
        nb.business_id, bl.city
      ORDER BY 
        nb.name
      LIMIT $1 OFFSET $2;
    `;

    const result = await connection.query(query, [limit, offset]);

    // Map categories from a semicolon-separated string to a list and calculate isOpen
    const restaurants = result.rows.map(row => {
      const isOpen = row.hours.some(hour => 
        hour.day_of_week === currentDay &&
        hour.open_time <= currentTime &&
        hour.close_time >= currentTime
      );

      return {
        business_id: row.business_id,
        name: row.name,
        stars: row.stars,
        review_count: row.review_count,
        categories: row.categories.split(';'),
        cuisine: row.cuisine,
        city: row.city,
        isOpen,
      };
    });

    res.status(200).json({ page: Number(page), limit: Number(limit), restaurants });
  } catch (error) {
    console.error('Error fetching restaurant details:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch restaurant details.' });
  }
};

const getRestaurantDetails = async (req, res) => {
  const { business_id } = req.query;

  console.log(business_id);

  try {
    // Query to fetch restaurant details
    const restaurantQuery = `
      SELECT 
        nb.name AS restaurant_name,
        CONCAT(bl.address, ', ', bl.city, ', ', bl.state, ', ', bl.postal_code) AS address,
        nb.cuisine,
        nb.stars,
        json_build_object(
          'wifi', nba.wifi,
          'outdoor_seating', nba.outdoor_seating,
          'parking_garage', nba.parking_garage,
          'parking_street', nba.parking_street,
          'parking_validated', nba.parking_validated,
          'parking_lot', nba.parking_lot,
          'parking_valet', nba.parking_valet,
          'good_for_groups', nba.good_for_groups,
          'alcohol', nba.alcohol,
          'price_range', nba.price_range,
          'noise_level', nba.noise_level,
          'wheelchair_accessible', nba.wheelchair_accessible,
          'has_tv', nba.has_tv
        ) AS amenities,
        json_agg(
          json_build_object(
            'day_of_week', nbh.day_of_week,
            'open_time', nbh.open_time,
            'close_time', nbh.close_time
          ) ORDER BY nbh.day_of_week
        ) AS business_hours
      FROM 
        normalized_businesses nb
      JOIN 
        business_locations bl
      ON 
        nb.location_id = bl.location_id
      JOIN 
        normalized_business_attributes nba
      ON 
        nb.business_id = nba.business_id
      JOIN 
        normalized_business_hours nbh
      ON 
        nb.business_id = nbh.business_id
      WHERE 
        nb.business_id = $1
      GROUP BY 
        nb.business_id, bl.address, bl.city, bl.state, bl.postal_code, nba.business_id;
    `;

    const restaurantResult = await connection.query(restaurantQuery, [business_id]);

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    const restaurant = restaurantResult.rows[0];

    // Query to fetch reviews
    const reviewsQuery = `
      SELECT 
        u.username AS user_name,
        ur.stars AS review_star,
        ur.review_date,
        ur.review_text
      FROM 
        normalized_user_reviews ur
      JOIN 
        users u
      ON 
        ur.user_id = u.user_id
      WHERE 
        ur.business_id = $1
      ORDER BY 
        ur.review_date DESC;
    `;

    const reviewsResult = await connection.query(reviewsQuery, [business_id]);

    const response = {
      restaurant_name: restaurant.restaurant_name,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      stars: restaurant.stars,
      amenities: restaurant.amenities,
      business_hours: restaurant.business_hours,
      reviews: reviewsResult.rows,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching restaurant details:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch restaurant details.' });
  }
};

const getBusinessNames = async (req, res) => {
  try {
    const query = `
      SELECT business_id, name
      FROM normalized_businesses
      ORDER BY name;
    `;

    const result = await connection.query(query);

    // Return the list of businesses with business_id and name
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching business names:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to fetch business names.' });
  }
};

const postReview = async (req, res) => {
  const { user_id, business_id, stars, review_text, useful = 0, funny = 0, cool = 0 } = req.body;

  if (!user_id || !business_id || !stars || !review_text) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const reviewId = uuidv4();
  try {
    const query = `
      INSERT INTO normalized_user_reviews (
        review_id, user_id, business_id, stars, review_text, review_date, useful, funny, cool, cleaned_text
      )
      VALUES (
        $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8, ''
      )
      RETURNING review_id, review_date;
    `;
    
    const values = [reviewId, user_id, business_id, stars, review_text, useful, funny, cool];
    const result = await connection.query(query, values);

    res.status(201).json({
      message: 'Review posted successfully.',
      review_id: result.rows[0].review_id,
      review_date: result.rows[0].review_date,
    });
  } catch (error) {
    console.error('Error posting review:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to post review.' });
  }
};

// Simple
//1
const topReviewRestaurants = async (req, res) => {
  try {
      const result = await connection.query(`
          SELECT b.name, l.city, COUNT(r.review_id) AS total_reviews
          FROM normalized_user_reviews r
          JOIN normalized_businesses b ON r.business_id = b.business_id
          JOIN business_locations l ON b.location_id = l.location_id
          GROUP BY b.name, l.city
          ORDER BY l.city, total_reviews DESC
          LIMIT 5;
      `);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}
//2
const averageStarsWifi = async (req, res) => {
  try {
      const result = await connection.query(`
          SELECT AVG(b.stars) AS avg_stars
          FROM normalized_businesses b
          JOIN normalized_business_attributes a ON b.business_id = a.business_id
          WHERE a.wifi = TRUE;
      `);
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}
//3
const mostFavouriteRestaurants = async (req, res) => {
  try {
      const result = await connection.query(`
          SELECT b.name, COUNT(f.favorite_id) AS favorite_count
          FROM user_favorites f
          JOIN normalized_businesses b ON f.business_id = b.business_id
          GROUP BY b.name
          ORDER BY favorite_count DESC
          LIMIT 10;
      `);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}
//4
const totalCheckinsWeekday = async (req, res) => {
  try {
      const result = await connection.query(`
          SELECT weekday, SUM(checkins) AS total_checkins
          FROM normalized_checkin
          GROUP BY weekday
          ORDER BY total_checkins DESC;
      `);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}
//5
const reviewPhotos = async (req, res) => {
  const { reviewId } = req.params;
  try {
      const result = await connection.query(`
          SELECT p.photo_url
          FROM review_photos p
          JOIN normalized_user_reviews r ON p.review_id = r.review_id
          WHERE r.review_id = $1;
      `, [reviewId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}


// Route 6: Top 3 Categories by Average Star Rating
const topCategories = async (req, res) => {
  const query = `
    SELECT categories, AVG(stars) AS avg_stars
    FROM normalized_businesses
    GROUP BY categories
    ORDER BY avg_stars DESC
    LIMIT 3;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    res.status(500).send('Error fetching top categories');
  }
};

// Route 7: Restaurants with the Most Tips
const mostTippedRestaurants = async (req, res) => {
  const query = `
    SELECT b.name, COUNT(t.tip_id) AS tip_count
    FROM tip t
    JOIN normalized_businesses b ON t.business_id = b.business_id
    GROUP BY b.name
    ORDER BY tip_count DESC
    LIMIT 5;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching most tipped restaurants:', error);
    res.status(500).send('Error fetching most tipped restaurants');
  }
};

// Route 8: Cities with the Most Restaurants Offering Outdoor Seating
const citiesWithOutdoorSeating = async (req, res) => {
  const query = `
    SELECT l.city, COUNT(b.business_id) AS total_restaurants
    FROM normalized_businesses b
    JOIN business_locations l ON b.location_id = l.location_id
    JOIN normalized_business_attributes a ON b.business_id = a.business_id
    WHERE a.outdoor_seating = TRUE
    GROUP BY l.city
    ORDER BY total_restaurants DESC;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cities with the most outdoor seating:', error);
    res.status(500).send('Error fetching cities with the most outdoor seating');
  }
};

// Route 9: Average Check-ins by Day of Week
const averageCheckins = async (req, res) => {
  const query = `
    SELECT b.name, c.weekday, AVG(c.checkins) AS avg_checkins
    FROM normalized_checkin c
    JOIN normalized_businesses b ON c.business_id = b.business_id
    GROUP BY b.name, c.weekday
    ORDER BY avg_checkins DESC;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching average check-ins:', error);
    res.status(500).send('Error fetching average check-ins');
  }
};

// Route 10: Most Helpful Reviews
const mostHelpfulReviews = async (req, res) => {
  const query = `
    SELECT u.username, r.review_text, SUM(r.useful) AS helpful_votes
    FROM normalized_user_reviews r
    JOIN users u ON r.user_id = u.user_id
    GROUP BY u.username, r.review_text
    ORDER BY helpful_votes DESC
    LIMIT 10;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching most helpful reviews:', error);
    res.status(500).send('Error fetching most helpful reviews');
  }
};

// Complex:
// Route 1: Top 5 cities in Pennsylvania with the highest number of diverse high-rated restaurants
const topCitiesDiverseHighRated = async (req, res) => {
  const query = `
      WITH HighRatedRestaurants AS (
         SELECT b.business_id, bl.city, AVG(r.stars) AS avg_rating
         FROM normalized_businesses b
         JOIN normalized_user_reviews r ON b.business_id = r.business_id
         JOIN business_locations bl ON b.location_id = bl.location_id
         WHERE bl.state = 'PA'
         GROUP BY b.business_id, bl.city
         HAVING AVG(r.stars) >= 4.5
      ),
      DiverseCategories AS (
         SELECT b.business_id, COUNT(DISTINCT b.categories) AS category_count
         FROM normalized_businesses b
         GROUP BY b.business_id
         HAVING COUNT(DISTINCT b.categories) >= 3
      )
      SELECT hr.city, COUNT(hr.business_id) AS num_restaurants
      FROM HighRatedRestaurants hr
      JOIN DiverseCategories dc ON hr.business_id = dc.business_id
      GROUP BY hr.city
      ORDER BY num_restaurants DESC
      LIMIT 5;
  `;
  try {
      const result = await connection.query(query);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}

// Route 2: Top 5 restaurants reviewed most by users whose friends also reviewed them
const topRestaurantsReviewedByUserFriends = async (req, res) => {
  const query = `
      WITH UserFriendsReviews AS (
         SELECT r.business_id, uf.user_id, COUNT(DISTINCT r.review_id) AS review_count_by_friends
         FROM normalized_user_reviews r
         JOIN user_stats uf ON r.user_id = uf.user_id
         GROUP BY r.business_id, uf.user_id
      ),
      PopularWithFriends AS (
         SELECT ufr.business_id, SUM(ufr.review_count_by_friends) AS total_reviews_by_friends
         FROM UserFriendsReviews ufr
         GROUP BY ufr.business_id
         ORDER BY total_reviews_by_friends DESC
         LIMIT 5
      )
      SELECT b.name AS restaurant_name, bl.city as city, pwf.total_reviews_by_friends
      FROM PopularWithFriends pwf
      JOIN normalized_businesses b ON pwf.business_id = b.business_id
      JOIN business_locations bl ON b.location_id = bl.location_id;
  `;
  try {
      const result = await connection.query(query);
      res.json(result.rows);
  } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
  }
}

const monthlyCheckinDistribution = async (req, res) => {
  const query = `
    WITH TotalCheckins AS (
       SELECT c.business_id, COUNT(c.checkin_id) AS total_checkins
       FROM normalized_checkin c
       JOIN normalized_businesses b ON c.business_id = b.business_id
       WHERE b.state = 'PA'
       GROUP BY c.business_id
       ORDER BY total_checkins DESC
       LIMIT 5
    ),
    MonthlyCheckinDistribution AS (
       SELECT tc.business_id, EXTRACT(MONTH FROM c.hour) AS checkin_month, COUNT(c.checkin_id) AS checkins_in_month
       FROM normalized_checkin c
       JOIN TotalCheckins tc ON c.business_id = tc.business_id
       GROUP BY tc.business_id, EXTRACT(MONTH FROM c.hour)
    )
    SELECT b.name AS restaurant_name, mcd.checkin_month, mcd.checkins_in_month
    FROM MonthlyCheckinDistribution mcd
    JOIN normalized_businesses b ON mcd.business_id = b.business_id
    ORDER BY restaurant_name, mcd.checkin_month;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching monthly check-in distribution:', error);
    res.status(500).send('Error fetching monthly check-in distribution');
  }
};


const happiestCity = async (req, res) => {
  const query = `
    WITH CityRestaurantCount AS (
       SELECT l.city, COUNT(DISTINCT b.business_id) AS num_restaurants
       FROM business_locations l
       JOIN normalized_businesses b ON l.location_id = b.location_id
       WHERE l.state = 'PA'
       GROUP BY l.city
       HAVING COUNT(DISTINCT b.business_id) >= 20
    ),
    CityReviewSentiment AS (
       SELECT crc.city, AVG(r.stars) AS avg_sentiment
       FROM normalized_user_reviews r
       JOIN normalized_businesses b ON r.business_id = b.business_id
       JOIN business_locations l ON b.location_id = l.location_id
       JOIN CityRestaurantCount crc ON l.city = crc.city
       GROUP BY crc.city
    )
    SELECT city, ROUND(avg_sentiment, 2) AS average_star_rating
    FROM CityReviewSentiment
    ORDER BY avg_sentiment DESC
    LIMIT 1;
  `;
  try {
    const result = await connection.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching happiest city:', error);
    res.status(500).send('Error fetching happiest city');
  }
};

// Additional
const openRestaurantsNow = async (req, res) => {
  const query = `
      SELECT b.name, l.city, l.address
      FROM normalized_business_hours h
      JOIN normalized_businesses b ON h.business_id = b.business_id
      JOIN business_locations l ON b.location_id = l.location_id
      WHERE h.day_of_week = TO_CHAR(CURRENT_DATE, 'Day')
        AND CURRENT_TIME BETWEEN h.open_time AND h.close_time;
  `;

  try {
      const result = await connection.query(query);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No restaurants are open at this time.' });
      }
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching open restaurants:', error);
      res.status(500).send('Internal Server Error');
  }
}

const restaurantsWithAmenities =  async (req, res) => {
  const { wifi, outdoor_seating, has_tv } = req.query;

  const query = `
      SELECT b.name, l.city, l.address
      FROM normalized_business_attributes a
      JOIN normalized_businesses b ON a.business_id = b.business_id
      JOIN business_locations l ON b.location_id = l.location_id
      WHERE ($1::BOOLEAN IS NULL OR a.wifi = $1)
        AND ($2::BOOLEAN IS NULL OR a.outdoor_seating = $2)
        AND ($3::BOOLEAN IS NULL OR a.has_tv = $3);
  `;

  try {
      const result = await connection.query(query, [wifi, outdoor_seating, has_tv]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching restaurants with amenities:', error);
      res.status(500).send('Internal Server Error');
  }
}

const addReview = async (req, res) => {
  console.log(req.body);
  const { review_id, user_id, business_id, stars, review_text, review_date, useful, funny, cool, cleaned_text } = req.body;

  const query = `
      INSERT INTO normalized_user_reviews (review_id, user_id, business_id, stars, review_text, review_date, useful, funny, cool, cleaned_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
  `;

  try {
      const result = await connection.query(query, [review_id, user_id, business_id, stars, review_text, review_date, useful, funny, cool, cleaned_text]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).send('Internal Server Error');
  }
}

const addCheckin = async (req, res) => {
  const { business_id, weekday, hour, checkins } = req.body;

  const query = `
      INSERT INTO normalized_checkin (business_id, weekday, hour, checkins)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
  `;

  try {
      const result = await connection.query(query, [business_id, weekday, hour, checkins]);
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error adding check-in:', error);
      res.status(500).send('Internal Server Error');
  }
}


module.exports = {
  topReviewRestaurants,
  averageStarsWifi,
  mostFavouriteRestaurants,
  totalCheckinsWeekday,
  reviewPhotos,
  topCitiesDiverseHighRated,
  topRestaurantsReviewedByUserFriends,
  topCategories,
  mostTippedRestaurants,
  citiesWithOutdoorSeating,
  mostHelpfulReviews,
  averageCheckins,
  monthlyCheckinDistribution,
  happiestCity,
  openRestaurantsNow,
  restaurantsWithAmenities,
  addReview,
  addCheckin,
  registerUser,
  logoutUser,
  checkUsername,
  loginUser,
  getUniqueCities,
  getUniqueCuisine,
  getRestaurants,
  getRestaurantDetails,
  getBusinessNames,
  postReview,
  sample: async (req, res) => res.status(200).json({ key: 'value' }),
}

// // Export routes and individual handlers
// module.exports = {
// };