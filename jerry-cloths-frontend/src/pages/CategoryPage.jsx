import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../components/CartContext';

const API_URL = 'http://localhost:8080/api';

export const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const images = (() => { try { return JSON.parse(product.images || '[]'); } catch { return product.imgUrl ? [product.imgUrl] : []; } })();
    const colors = (() => { try { return JSON.parse(product.colors || '[]'); } catch { return []; } })();
    const [activeImage, setActiveImage] = useState(images[0] || '');
    const [activeColor, setActiveColor] = useState(null);
    const [liked, setLiked] = useState(false);

    return (
        <div className="bg-white group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
            <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
                <img src={activeImage || 'https://placehold.co/400x500?text=No+Image'} alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }} />
                <button onClick={e => { e.stopPropagation(); setLiked(!liked); }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition">
                    <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">Sold Out</span>
                    </div>
                )}
            </div>
            <div className="pt-3 pb-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.subcategory || product.category}</p>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1">{product.name}</h3>
                <p className="text-sm text-gray-800 mb-3">${product.price?.toFixed(2)}</p>
                {colors.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {colors.map((c, i) => (
                            <button key={i} onClick={e => {
                                e.stopPropagation();
                                setActiveColor(i);
                                if (c.imageUrl) setActiveImage(c.imageUrl);
                            }}
                                title={c.label}
                                className={`w-10 h-10 rounded-sm overflow-hidden border-2 transition
                  ${activeColor === i ? 'border-gray-900' : 'border-gray-200 hover:border-gray-500'}`}>
                                {c.imageUrl ? <img src={c.imageUrl} alt={c.label} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const { category, subcategory } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const decodedCategory = decodeURIComponent(category || '');
    const decodedSubcategory = decodeURIComponent(subcategory || '');

    useEffect(() => { fetchProducts(); }, [category, subcategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url;
            if (decodedSubcategory) {
                url = `${API_URL}/products/category/${encodeURIComponent(decodedCategory)}/sub/${encodeURIComponent(decodedSubcategory)}`;
            } else {
                url = `${API_URL}/products/category/${encodeURIComponent(decodedCategory)}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const title = decodedSubcategory || decodedCategory;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{decodedCategory}</p>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">{title}</h1>
                    {!loading && <p className="text-sm text-gray-400 mt-2">{products.length} products</p>}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 rounded" style={{ aspectRatio: '3/4' }} />
                                <div className="mt-3 h-3 bg-gray-200 rounded w-3/4" />
                                <div className="mt-2 h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-lg">No products found in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                        {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;