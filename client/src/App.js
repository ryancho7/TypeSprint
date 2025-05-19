import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import Dashboard from './pages/Dashboard.js';
import Race from './pages/Race.js';
import './App.css';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/race" element={<Race />} />
        </Routes>
    </Router>
  );
}

export default App;
