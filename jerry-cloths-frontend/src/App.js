import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AllProducts from './pages/AllProducts';
import AllReviews from './pages/AllReviews';
import ContactUs from './pages/ContactUs';
import InfoPage from './pages/InfoPage';

function AppContent() {
  const location = useLocation();
  const hideRoutes = ['/login', '/signup'];
  const shouldShow = !hideRoutes.includes(location.pathname);

  return (
    <>
      {shouldShow && <Navbar />}
      <CartSidebar />
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/:subcategory" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/reviews" element={<AllReviews />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="/" element={<><Hero /><LatestArrivals /></>} />
        </Routes>
      </PageTransition>
      {shouldShow && <Footer />}
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