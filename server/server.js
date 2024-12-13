const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON payloads
const cors = require('cors');
const routes = require('./routes'); // Ensure this path is correct
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors({ origin: '*', credentials: true }));

// Middleware to handle JSON payloads
app.use(bodyParser.json());

// Define API endpoints
app.get('/sample', routes.sample); // Sample endpoint
app.post('/register', routes.registerUser); // Endpoint for user registration
app.post('/logout', routes.logoutUser); // Endpoint for user logout
app.post('/checkusername', routes.checkUsername);

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});

// Export the app for external usage/testing
module.exports = app;