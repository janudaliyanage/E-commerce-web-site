import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  const shouldShowFooter = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <CartSidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/" element={<><Hero /><LatestArrivals /></>} />
      </Routes>
      {shouldShowFooter && <Footer />}
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