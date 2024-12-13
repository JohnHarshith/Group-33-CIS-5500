const express = require('express');
const { Pool, types } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // To generate random user_id
require('dotenv').config(); // Load environment variables

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
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const query = `
      UPDATE users
      SET last_login = CURRENT_TIMESTAMP
      WHERE username = $1
      RETURNING last_login;
    `;
    const result = await connection.query(query, [username]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Logout successful.', lastLogin: result.rows[0].last_login });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Failed to log out user.' });
  }
};

// Export routes and individual handlers
module.exports = {
  sample: async (req, res) => res.status(200).json({ key: 'value' }),
  registerUser,
  logoutUser,
};