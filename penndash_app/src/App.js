import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/loginregister/loginregister';
import './App.css';
import Home from './components/home/home';
import Logout from './components/logout/logout';
import Analytics from './components/analytics/analytics';
import Bookmarks from './components/bookmarks/bookmarks';
import RestaurantPage from './components/restaurantpage/restaurantpage';
import Favorites from './components/favorites/favorites';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <header className="App-header">
          <h1>PennDash</h1>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/restaurantpage" element={<RestaurantPage />} />
          <Route path="/favorites" element={<Favorites />} />

        </Routes>

        {/* Footer */}
        <footer className="App-footer">
          <p>© 2024 PennDash. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;