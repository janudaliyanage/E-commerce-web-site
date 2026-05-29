import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllProducts } from '../services/api';

const LatestArrivals = () => {
  const [activeTab, setActiveTab] = useState('him');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProducts();
        
        // Map backend data to frontend format
        const mappedProducts = data.map((product, index) => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          price: product.price || 0,
          img: product.imgUrl || 'https://via.placeholder.com/300',
          description: product.description || '',
          category: product.category?.toLowerCase().includes('her') ? 'her' : 'him',
          soldOut: product.stock <= 0 || product.status === 'inactive',
          stock: product.stock || 0,
          colors: product.colors ? product.colors.split(',').map(c => c.trim()) : ['#000000'],
          sizes: product.sizes ? product.sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L'],
          categoryTag: product.category || 'NEW DROP'
        }));
        
        setProducts(mappedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // Filter products by active tab
  const filtered = products.filter(p => p.category === activeTab);

  // Color hex map for better display
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#808080',
    'Grey': '#808080',
    'Navy': '#000080',
    'Blue': '#0000FF',
    'Red': '#FF0000',
    'Pink': '#FFC0CB',
    'Purple': '#800080',
    'Yellow': '#FFFF00',
    'Gold': '#FFD700',
  };

  // Convert color names to hex
  const getColorHex = (colorName) => {
    return colorMap[colorName] || colorName || '#000000';
  };

  return (
    <section className="py-12 bg-[#F2F2F2]">
      
      {/* TABS */}
      <div className="flex justify-center space-x-12 mb-10 border-b border-gray-300 max-w-xs mx-auto">
        {['him', 'her'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold tracking-[0.2em] uppercase transition-all border-b-2 ${
              activeTab === tab 
                ? 'border-black text-black' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            For {tab}
          </button>
        ))}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="flex justify-center items-center py-12">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* NO PRODUCTS STATE */}
      {!loading && filtered.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500 text-sm">No products available for {activeTab}</p>
        </div>
      )}

      {/* PRODUCT GRID - 2 Columns on Mobile, 4 on Desktop */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-10 px-2 md:px-6 max-w-[1600px] mx-auto">
          {filtered.map((product) => (
            <div key={product.id} className="group cursor-pointer flex flex-col items-center">
              
              {/* Image Container */}
              <div className="relative w-full overflow-hidden aspect-[4/5] mb-4 bg-gray-200">
                {product.soldOut && (
                  <span className="absolute top-2 left-2 bg-white/90 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">
                    Sold Out
                  </span>
                )}
                
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=Product';
                  }}
                />

                {/* Hover Arrow (Desktop only) */}
                <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-3xl font-light">›</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="text-center w-full">
                <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.15em] mb-1.5 text-gray-800 truncate px-2">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-xs tracking-wider mb-3">
                  ${product.price.toFixed(2)}
                </p>

                {/* Category Tag */}
                {product.categoryTag && (
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-2">
                    {product.categoryTag}
                  </p>
                )}

                {/* Color Swatches */}
                <div className="flex justify-center space-x-1 flex-wrap">
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((color, idx) => (
                      <div 
                        key={idx}
                        className="w-4 h-4 md:w-5 md:h-5 border border-gray-300 rounded-sm" 
                        style={{ 
                          backgroundColor: getColorHex(color),
                          borderColor: getColorHex(color) === '#FFFFFF' ? '#999' : '#ccc'
                        }}
                        title={color}
                      />
                    ))
                  ) : (
                    <div 
                      className="w-4 h-4 md:w-5 md:h-5 border border-gray-300 rounded-sm" 
                      style={{ backgroundColor: '#000000' }}
                      title="Black"
                    />
                  )}
                </div>

                {/* Stock Info */}
                {product.stock !== undefined && !product.soldOut && (
                  <p className="text-[8px] text-gray-400 mt-2">
                    Stock: {product.stock}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "ALL FOR ..." BUTTON */}
      {!loading && (
        <div className="flex justify-center mt-12 px-4">
          <Link 
            to={`/collections/${activeTab}`} 
            className="w-full md:w-auto bg-[#121212] text-white text-xs font-bold tracking-[0.2em] uppercase py-4 px-16 text-center hover:opacity-90 transition"
          >
            All For {activeTab}
          </Link>
        </div>
      )}

    </section>
  );
};

export default LatestArrivals;