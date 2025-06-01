import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/authContext.js';
import { useState, useEffect } from 'react'
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Race from './pages/Race.js';
import Records from './pages/Records.js';
import Leaderboard from './pages/Leaderboard.js';
import UpperNav from './components/UpperNav.js';
import './App.css';

function AppContent() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    inGuestMode: false,
    user: null,
  });

  const location = useLocation();
  
  // Pages where navbar should not be shown
  const hideNavbarRoutes = ['/'];

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

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div className="min-h-screen">
        {shouldShowNavbar && <UpperNav auth={auth} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/race" element={<Race />} />
          <Route path="/records" element={<Records />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
