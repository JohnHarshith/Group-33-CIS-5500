import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/loginregister/loginregister';
import './App.css';
import Home from './components/home/home';
import Logout from './components/logout/logout';

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