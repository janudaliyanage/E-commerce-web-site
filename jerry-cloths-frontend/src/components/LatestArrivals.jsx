import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { fetchAllProducts } from '../services/api';

const LatestArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Arrivals</h2>
            <p className="text-gray-600 mt-2">Discover our newest gym apparel collection</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="relative bg-gray-200 h-64 overflow-hidden group">
                  <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                    }}
                  />

                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Stock Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 0
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        }`}
                    >
                      {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Category */}
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    {product.category}
                  </p>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description || 'High-quality gym apparel for peak performance'}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <button className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestArrivals;