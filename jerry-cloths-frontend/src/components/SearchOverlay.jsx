import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const timer = setTimeout(() => doSearch(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const doSearch = async (q) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.slice(0, 6)); // show max 6 in overlay
        } catch (err) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            onClose();
        }
    };

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
        onClose();
    };

    const getImage = (product) => {
        try { return JSON.parse(product.images || '[]')[0] || product.imgUrl || ''; }
        catch { return product.imgUrl || ''; }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />

            {/* Search panel */}
            <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-2xl">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {/* Input */}
                    <form onSubmit={handleSubmit}>
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-gray-400" size={20} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="w-full pl-12 pr-16 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition"
                            />
                            {query && (
                                <button type="button" onClick={() => { setQuery(''); setResults([]); }}
                                    className="absolute right-14 text-gray-400 hover:text-black">
                                    <X size={18} />
                                </button>
                            )}
                            <button type="button" onClick={onClose}
                                className="absolute right-3 text-gray-400 hover:text-black transition">
                                <X size={22} />
                            </button>
                        </div>
                    </form>

                    {/* Quick Results */}
                    {loading && (
                        <div className="mt-4 text-sm text-gray-400 text-center py-4">Searching...</div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Products</p>
                            <div className="space-y-2">
                                {results.map(product => (
                                    <button key={product.id} onClick={() => handleProductClick(product.id)}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition text-left">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={getImage(product)} alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.target.src = 'https://placehold.co/48x48?text=?'; }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-400">{product.subcategory || product.category}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">${product.price?.toFixed(2)}</p>
                                    </button>
                                ))}
                            </div>

                            {/* View all results */}
                            <button onClick={handleSubmit}
                                className="w-full mt-3 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                                View all results for "{query}" <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="mt-6 text-center text-gray-400 py-4">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchOverlay;