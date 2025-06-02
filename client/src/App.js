import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './contexts/authContext.js';
import { useState, useEffect } from 'react'
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Race from './pages/Race.js';
import Records from './pages/Records.js';
import Leaderboard from './pages/Leaderboard.js';
import UpperNav from './components/UpperNav.js';
import FriendsModal from './components/FriendsModal.js';
import './App.css';

function AppContent() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    inGuestMode: false,
    user: null,
  });

  // State for friends modal (lifted up to App level)
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [page, setPage] = useState(1);  

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
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/race" element={<Race />} />
            <Route path="/records" element={<Records />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        
        {/* FriendsModal here - appear from any page */}
        <FriendsModal
          open={showFriendsModal}
          onClose={() => setShowFriendsModal(false)}
          page={page}
          totalPages={1}
          onPageChange={(p) => setPage(p)}
        />
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