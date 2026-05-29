import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, Package, Plus, BarChart3 } from 'lucide-react';
import { fetchAllProducts } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminEmail = localStorage.getItem('adminEmail') || 'Admin';

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const stats = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { title: 'In Stock', value: products.filter(p => p.stock > 0).length, icon: BarChart3, color: 'bg-green-500' },
    { title: 'Low Stock', value: products.filter(p => p.stock > 0 && p.stock < 10).length, icon: Package, color: 'bg-yellow-500' },
    { title: 'Out of Stock', value: products.filter(p => p.stock <= 0).length, icon: Package, color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Jerry Cloths Admin</h1>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-sm text-gray-600">{adminEmail}</span>
            <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-3 space-y-2">
            <p className="text-sm text-gray-600 px-3 py-2">{adminEmail}</p>
            <button onClick={handleLogout} className="w-full flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {adminEmail}</h2>
          <p className="text-gray-600">Manage your products and inventory from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/products" className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition font-medium">
              <Package size={20} />
              <span>View All Products</span>
            </Link>
            <Link to="/admin/products/add" className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition font-medium">
              <Plus size={20} />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">No products yet. Create your first product!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">${product.price?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {products.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-200 text-center">
              <Link to="/admin/products" className="text-blue-500 hover:text-blue-700 font-medium">
                View all {products.length} products →
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;