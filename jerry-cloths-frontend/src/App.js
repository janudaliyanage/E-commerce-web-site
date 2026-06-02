import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <>
            <Hero />
            <LatestArrivals />
          </>
        } />
      </Routes>
    </>
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