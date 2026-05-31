import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/Context.js';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';

// Utils
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const location = useLocation();

  // Hide navbar on auth routes
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <CartDrawer />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Home Route */}
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
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;