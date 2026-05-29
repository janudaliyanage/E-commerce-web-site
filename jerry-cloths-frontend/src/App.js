import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestArrivals from './components/LatestArrivals';
import { Gallery, Footer } from './components/FooterSection';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts'; // Ensure this file exists in src/pages/admin/
import AddProduct from './pages/admin/AddProduct';       // Ensure this file exists in src/pages/admin/

function App() {
  return (
    <Router>
      <Routes>
        
        {/* --- PUBLIC SHOPPER ROUTES --- */}
        <Route path="/" element={
          <div className="font-sans text-brand-black bg-white min-h-screen flex flex-col">
            <Navbar />
            <main>
              <Hero />
              <LatestArrivals />
              <Gallery />
            </main>
            <Footer />
          </div>
        } />
        
        {/* Auth Pages (Public) */}
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />


        {/* --- ADMIN AREA --- */}
        
        {/* 1. Admin Login (Publicly accessible) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 2. Protected Routes (Only accessible with Token) */}
        <Route element={<ProtectedRoute />}>
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
           <Route path="/admin/products" element={<AdminProducts />} />
           <Route path="/admin/products/add" element={<AddProduct />} />
        </Route>

        <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;