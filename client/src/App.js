import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from './contexts/authContext.js';
import { useState, useEffect } from 'react'
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Race from './pages/Race.js';
import Records from './pages/Records.js';
import Leaderboard from './pages/Leaderboard.js';
import './App.css';

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    inGuestMode: null,
    user: null,
  });

  useEffect(() => {
    const storedGuest = window.localStorage.getItem('guestUsername');
    if (storedGuest) {
      setAuth({
        isAuthenticated: true,
        inGuestMode: true,
        user: { username: storedGuest, name: "Guest" }
      });
      return;
    }

    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setAuth({ ...data, inGuestMode: false }))
      .catch(() => setAuth({ isAuthenticated: false, inGuestMode: false, user: null }))
  }, [])


  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/race" element={<Race />} />
          <Route path="/records" element={<Records />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
