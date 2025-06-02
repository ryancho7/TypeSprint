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

  // State for friends modal (lifted up to App level)
  const [showFriendsModal, setShowFriendsModal] = useState(false);

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
      <div className="flex flex-col h-screen">
        {shouldShowNavbar && (
          <UpperNav 
            auth={auth} 
            onFriendsClick={() => setShowFriendsModal(true)} 
          />
        )}
        <main className="flex flex-col flex-1 overflow-auto bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <Dashboard 
                showFriendsModal={showFriendsModal}
                setShowFriendsModal={setShowFriendsModal}
              />
            } />
            <Route path="/race" element={<Race />} />
            <Route path="/records" element={<Records />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
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