import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const StarRow = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
            <Star key={n} size={14}
                className={n <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
        ))}
    </div>
);

const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [productsById, setProductsById] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/reviews`).then(r => r.json()).catch(() => []),
            fetch(`${API_URL}/products`).then(r => r.json()).catch(() => []),
        ]).then(([reviewData, productData]) => {
            setReviews(Array.isArray(reviewData) ? reviewData : []);
            const map = {};
            (Array.isArray(productData) ? productData : []).forEach(p => { map[p.id] = p; });
            setProductsById(map);
        }).finally(() => setLoading(false));
    }, []);

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Explore</p>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Customer Reviews</h1>
                    {!loading && (
                        <p className="text-sm text-gray-500 mt-2">
                            {avgRating ? `${avgRating} average` : 'No reviews yet'} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-xl p-5 h-28" />
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-lg">No reviews yet — be the first to leave one on a product page!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map(review => {
                            const product = productsById[review.productId];
                            let images = [];
                            try { images = JSON.parse(review.images || '[]'); } catch { /* noop */ }
                            return (
                                <div key={review.id} className="bg-white rounded-xl border border-gray-100 p-5">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{review.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-400">
                                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                                {review.verified && <span className="ml-2 text-green-600 font-medium">Verified Purchase</span>}
                                            </p>
                                        </div>
                                        {product && (
                                            <Link to={`/products/${product.id}`}
                                                className="flex-shrink-0 text-xs font-medium text-gray-500 hover:text-black border border-gray-200 rounded-full px-3 py-1 transition">
                                                {product.name}
                                            </Link>
                                        )}
                                    </div>
                                    <StarRow rating={review.rating} />
                                    {review.fitFeedback && (
                                        <p className="text-xs text-gray-400 mt-1.5">Fit: {review.fitFeedback}</p>
                                    )}
                                    {review.comment && (
                                        <p className="text-sm text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                                    )}
                                    {images.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {images.slice(0, 4).map((img, i) => (
                                                <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllReviews;