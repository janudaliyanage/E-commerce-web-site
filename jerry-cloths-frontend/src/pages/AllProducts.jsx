import React, { useState, useEffect } from 'react';
import { ProductCard } from './CategoryPage';

const API_URL = 'http://localhost:8080/api';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Shop With Us</p>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">All Products</h1>
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
                        <p className="text-gray-400 text-lg">No products yet.</p>
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

export default AllProducts;