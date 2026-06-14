import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X, Heart } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const images = (() => { try { return JSON.parse(product.images || '[]'); } catch { return product.imgUrl ? [product.imgUrl] : []; } })();
    const [liked, setLiked] = useState(false);

    return (
        <div className="bg-white group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
            <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
                <img
                    src={images[0] || 'https://placehold.co/400x500?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
                />
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
                <p className="text-sm text-gray-800">${product.price?.toFixed(2)}</p>
            </div>
        </div>
    );
};

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [inputValue, setInputValue] = useState(query);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        setInputValue(query);
        if (query) {
            doSearch(query);
        } else {
            setResults([]);
            setSearched(false);
        }
    }, [query]);

    const doSearch = async (q) => {
        if (!q.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(q.trim())}`);
            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error('Search failed', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setSearchParams({ q: inputValue.trim() });
        }
    };

    const handleClear = () => {
        setInputValue('');
        setSearchParams({});
        setResults([]);
        setSearched(false);
        inputRef.current?.focus();
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Search Header */}
            <div className="border-b border-gray-200 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-gray-400" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition"
                            />
                            {inputValue && (
                                <button type="button" onClick={handleClear}
                                    className="absolute right-14 text-gray-400 hover:text-black transition">
                                    <X size={20} />
                                </button>
                            )}
                            <button type="submit"
                                className="absolute right-3 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-10">
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
                ) : searched && results.length === 0 ? (
                    <div className="text-center py-20">
                        <Search size={48} className="text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No results for "{query}"</h2>
                        <p className="text-gray-500 mb-6">Try different keywords or browse our categories</p>
                        <button onClick={() => navigate('/')}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
                            Browse All Products
                        </button>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                            {results.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    </>
                ) : !searched ? (
                    <div className="text-center py-20">
                        <Search size={48} className="text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Type something to search</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default SearchPage;