import React, { useEffect, useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { fetchAllProducts } from '../services/api';
import { CartContext } from '../Context/Context';

const LatestArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef(null);

  const { addToCart } = useContext(CartContext);

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

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(scrollPosition + scrollAmount);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
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
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 hover:bg-gray-200 rounded-full transition"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-full sm:w-96 bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
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

                  {/* Color Swatches */}
                  {product.colors && (
                    <div className="flex gap-2 mb-4">
                      {product.colors.split(',').map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer hover:border-gray-600 transition"
                          title={color.trim()}
                          style={{
                            backgroundColor: color.trim().toLowerCase().replace(/\s+/g, ''),
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition mb-2 ${product.stock > 0
                      ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>

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

        {/* Mobile Scroll Indicator */}
        <p className="text-center text-gray-500 text-sm mt-4 md:hidden">
          ← Swipe to see more →
        </p>
      </div>
    </section>
  );
};

export default LatestArrivals;