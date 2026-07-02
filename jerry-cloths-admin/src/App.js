import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import EditSite from './pages/EditSite';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import Offers from './pages/Offers';
import Newsletter from './pages/Newsletter';
import Messages from './pages/Messages';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct />} />
        <Route path="/admin/edit" element={<EditSite />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/sales" element={<Sales />} />
        <Route path="/admin/offers" element={<Offers />} />
        <Route path="/admin/stock" element={<ComingSoon title="Stock" />} />
        <Route path="/admin/newsletter" element={<Newsletter />} />
        <Route path="/admin/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;