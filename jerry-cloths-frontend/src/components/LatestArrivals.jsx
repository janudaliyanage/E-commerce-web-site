import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAllProducts } from '../services/api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const images = (() => {
    try { return JSON.parse(product.images || '[]'); } catch { return product.imgUrl ? [product.imgUrl] : []; }
  })();

  const colors = (() => {
    try { return JSON.parse(product.colors || '[]'); } catch { return []; }
  })();

  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [activeColor, setActiveColor] = useState(null);
  const [liked, setLiked] = useState(false);

  const handleColorClick = (e, colorObj, index) => {
    e.stopPropagation();
    setActiveColor(index);
    if (colorObj.imageUrl) setActiveImage(colorObj.imageUrl);
  };

  return (
    <div className="bg-white group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
        <img
          src={activeImage || 'https://placehold.co/400x500?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
        />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">Sold Out</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.id} — {product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">{product.name}</h3>
        <p className="text-sm text-gray-800 mb-3">${product.price?.toFixed(2)}</p>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {colors.map((c, i) => (
              <button key={i} onClick={(e) => handleColorClick(e, c, i)} title={c.label}
                className={`w-10 h-10 rounded-sm overflow-hidden border-2 transition
                  ${activeColor === i ? 'border-gray-900' : 'border-gray-200 hover:border-gray-500'}`}>
                {c.imageUrl
                  ? <img src={c.imageUrl} alt={c.label} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-200" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LatestArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded" style={{ aspectRatio: '3/4' }} />
                <div className="mt-3 h-3 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-tight">Latest Arrivals</h2>
          <p className="text-gray-500 mt-2">Discover our newest collection</p>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">No products available</div>
        )}
      </div>
    </section>
  );
};

export default LatestArrivals;