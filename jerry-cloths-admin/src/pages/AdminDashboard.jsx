import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, DollarSign, AlertTriangle,
  Plus, ArrowRight, Mail, MessageSquare, Star, TrendingUp
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { fetchAllProducts } from '../services/api';

const API_URL = 'http://localhost:8080/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
};

const AdminDashboard = () => {
  const adminEmail = localStorage.getItem('adminEmail') || 'admin';

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAllProducts().catch(() => []),
      fetch(`${API_URL}/orders`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/reviews`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/newsletter/subscribers`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/contact`).then(r => r.json()).catch(() => []),
    ]).then(([p, o, r, s, m]) => {
      setProducts(Array.isArray(p) ? p : []);
      setOrders(Array.isArray(o) ? o.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
      setReviews(Array.isArray(r) ? r : []);
      setSubscribers(Array.isArray(s) ? s : []);
      setMessages(Array.isArray(m) ? m : []);
    }).finally(() => setLoading(false));
  }, []);

  // Computed stats
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStock = products.filter(p => p.stock === 0 || p.stock === null);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const unreadMsgs = messages.filter(m => !m.read).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '—';

  // Revenue this week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const salesThisWeek = orders
    .filter(o => new Date(o.createdAt) > oneWeekAgo)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${totalSales.toFixed(2)}`,
      sub: salesThisWeek > 0 ? `+$${salesThisWeek.toFixed(2)} this week` : 'No sales yet',
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Orders',
      value: orders.length,
      sub: pendingOrders > 0 ? `${pendingOrders} pending` : 'All caught up ✓',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      link: '/admin/orders',
      alert: pendingOrders > 0,
    },
    {
      title: 'Total Products',
      value: products.length,
      sub: outOfStock.length > 0 ? `${outOfStock.length} out of stock` : 'All in stock ✓',
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
      alert: outOfStock.length > 0,
    },
    {
      title: 'Low Stock',
      value: lowStock.length,
      sub: lowStock.length > 0 ? 'Items need restock' : 'Stock levels good ✓',
      icon: AlertTriangle,
      color: lowStock.length > 0 ? 'bg-orange-500' : 'bg-gray-400',
      link: '/admin/products',
      alert: lowStock.length > 0,
    },
  ];

  const quickStats = [
    { icon: Mail, label: 'Subscribers', value: subscribers.length, link: '/admin/newsletter' },
    { icon: MessageSquare, label: 'Unread Messages', value: unreadMsgs, link: '/admin/messages', alert: unreadMsgs > 0 },
    { icon: Star, label: 'Avg Rating', value: avgRating, link: '/admin/products' },
    { icon: TrendingUp, label: 'Reviews', value: reviews.length, link: '/admin/products' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            Welcome back, {adminEmail.split('@')[0]}! Here's what's happening.
          </p>
        </div>

        {/* Main Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => {
            const Icon = card.icon;
            return (
              <Link key={card.title} to={card.link}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition block">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{loading ? '…' : card.value}</p>
                <p className={`text-xs font-medium ${card.alert ? 'text-orange-500' : 'text-gray-400'}`}>
                  {loading ? '—' : card.sub}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickStats.map(qs => {
            const Icon = qs.icon;
            return (
              <Link key={qs.label} to={qs.link}
                className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 hover:shadow-sm transition">
                <div className={`p-2 rounded-lg ${qs.alert ? 'bg-red-50' : 'bg-gray-50'}`}>
                  <Icon size={15} className={qs.alert ? 'text-red-500' : 'text-gray-400'} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{loading ? '…' : qs.value}</p>
                  <p className="text-xs text-gray-400">{qs.label}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two-column bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Orders — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-gray-400 hover:text-black transition">View all →</Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-10 bg-gray-50 rounded-lg" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No orders yet.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.slice(0, 6).map(order => (
                  <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition">
                    <div className="w-10 flex-shrink-0">
                      <p className="text-xs text-gray-400">#{order.id}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{order.email || '—'}</p>
                      <p className="text-xs text-gray-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ${Number(order.total || 0).toFixed(2)}
                    </p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize flex-shrink-0
                                            ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Low Stock + Quick Actions */}
          <div className="space-y-4">

            {/* Low / Out of Stock */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Stock Alert</h2>
                <Link to="/admin/products" className="text-xs text-gray-400 hover:text-black transition">Manage →</Link>
              </div>
              {loading ? (
                <div className="p-4 space-y-2">
                  {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse h-8 bg-gray-50 rounded" />)}
                </div>
              ) : [...outOfStock, ...lowStock].length === 0 ? (
                <div className="p-5 text-center text-sm text-gray-400">All products well stocked ✓</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[...outOfStock, ...lowStock].slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between px-5 py-3">
                      <p className="text-sm text-gray-800 truncate flex-1">{p.name}</p>
                      <span className={`text-xs font-semibold flex-shrink-0 ml-2 px-2 py-0.5 rounded-full
                                                ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        {p.stock === 0 ? 'Out' : `${p.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link to="/admin/products/add"
                className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition w-full">
                <Plus size={16} />
                <span className="text-sm font-medium">Add New Product</span>
                <ArrowRight size={14} className="ml-auto" />
              </Link>
              <Link to="/admin/orders"
                className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition w-full">
                <ShoppingCart size={16} />
                <span className="text-sm font-medium">View Orders</span>
                {pendingOrders > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingOrders}
                  </span>
                )}
              </Link>
              <Link to="/admin/messages"
                className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition w-full">
                <MessageSquare size={16} />
                <span className="text-sm font-medium">Messages</span>
                {unreadMsgs > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadMsgs}
                  </span>
                )}
              </Link>
              <Link to="/admin/newsletter"
                className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition w-full">
                <Mail size={16} />
                <span className="text-sm font-medium">Newsletter</span>
                <span className="ml-auto text-xs text-gray-400">{subscribers.length} subscribers</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;