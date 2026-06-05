import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, BarChart2, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { fetchAllProducts } from '../services/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500', change: '+2 this week' },
    { title: 'Total Orders', value: 0, icon: ShoppingCart, color: 'bg-purple-500', change: 'Coming soon' },
    { title: 'Total Sales', value: '$0', icon: BarChart2, color: 'bg-green-500', change: 'Coming soon' },
    { title: 'Low Stock', value: products.filter(p => p.stock > 0 && p.stock < 10).length, icon: TrendingUp, color: 'bg-orange-500', change: 'Items need restock' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {adminEmail.split('@')[0]}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to="/admin/products/add"
            className="flex items-center gap-3 bg-black text-white px-5 py-4 rounded-xl hover:bg-gray-800 transition">
            <Plus size={20} />
            <span className="font-medium">Add New Product</span>
            <ArrowRight size={16} className="ml-auto" />
          </Link>
          <Link to="/admin/products"
            className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-5 py-4 rounded-xl hover:bg-gray-50 transition">
            <Package size={20} />
            <span className="font-medium">Manage Products</span>
            <ArrowRight size={16} className="ml-auto" />
          </Link>
          <Link to="/admin/edit"
            className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-5 py-4 rounded-xl hover:bg-gray-50 transition">
            <BarChart2 size={20} />
            <span className="font-medium">Edit Website</span>
            <ArrowRight size={16} className="ml-auto" />
          </Link>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-blue-500 hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No products yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Stock</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.slice(0, 6).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-3 text-gray-500">{product.category}</td>
                      <td className="px-6 py-3 text-gray-700">${product.price?.toFixed(2)}</td>
                      <td className="px-6 py-3 text-gray-700">{product.stock}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'}`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;