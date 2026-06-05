import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { fetchAllProducts, deleteProduct } from '../services/api';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { loadProducts(); }, []);
  useEffect(() => { filterProducts(); }, [products, searchTerm, categoryFilter]);

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

  const filterProducts = () => {
    let filtered = products;
    if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (categoryFilter !== 'all') filtered = filtered.filter(p => p.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getProductImage = (product) => {
    try {
      const images = JSON.parse(product.images || '[]');
      return images[0] || product.imgUrl || '';
    } catch {
      return product.imgUrl || '';
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          <Link to="/admin/products/add"
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input type="text" placeholder="Search products..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-3">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No products found.
              <Link to="/admin/products/add" className="text-blue-500 hover:underline ml-1">Add one →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3 text-left">Product</th>
                    <th className="px-5 py-3 text-left">Price</th>
                    <th className="px-5 py-3 text-left">Category</th>
                    <th className="px-5 py-3 text-left">Stock</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">${product.price?.toFixed(2)}</td>
                      <td className="px-5 py-3 text-gray-500">{product.category}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{product.stock}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'}`}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-700 font-medium">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(product.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;