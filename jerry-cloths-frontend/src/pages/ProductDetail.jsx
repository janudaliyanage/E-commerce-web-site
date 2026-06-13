import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { useCart } from '../components/CartContext';

const API_URL = 'http://localhost:8080/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [liked, setLiked] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products/${id}`);
            const data = await res.json();
            setProduct(data);
            const allRes = await fetch(`${API_URL}/products`);
            const allData = await allRes.json();
            setRelatedProducts(allData.filter(p => p.id !== data.id && p.category === data.category).slice(0, 4));
        } catch (err) {
            console.error('Failed to fetch product');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews/product/${id}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (err) {
            setReviews([]);
        }
    };

    const handleAddToCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const colors = getColors();
        const colorObj = selectedColor !== null ? colors[selectedColor] : null;
        const success = addToCart(product, colorObj, selectedSize);
        if (success) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.name || !reviewForm.comment) {
            alert('Please fill in all fields');
            return;
        }
        setSubmittingReview(true);
        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...reviewForm, productId: parseInt(id) }),
            });
            if (res.ok) {
                const newReview = await res.json();
                setReviews(prev => [newReview, ...prev]);
                setReviewForm({ name: '', rating: 5, comment: '' });
                setShowReviewForm(false);
            }
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const getImages = () => {
        try { return JSON.parse(product?.images || '[]'); }
        catch { return product?.imgUrl ? [product.imgUrl] : []; }
    };

    const getColors = () => {
        try { return JSON.parse(product?.colors || '[]'); }
        catch { return []; }
    };

    const getSizes = () => {
        if (!product?.sizes) return [];
        return product.sizes.split(',').map(s => s.trim()).filter(Boolean);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const handleColorClick = (color, index) => {
        setSelectedColor(index);
        if (color.imageUrl) {
            const images = getImages();
            const imgIndex = images.indexOf(color.imageUrl);
            if (imgIndex !== -1) setActiveImage(imgIndex);
            else setActiveImage(0);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Product not found</p>
        </div>
    );

    const images = getImages();
    const colors = getColors();
    const sizes = getSizes();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-8 shadow-sm">
                    {/* Left - Images */}
                    <div>
                        <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '3/4' }}>
                            <img
                                src={images[activeImage] || 'https://placehold.co/600x800?text=No+Image'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=No+Image'; }}
                            />
                            <button onClick={() => setLiked(!liked)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow">
                                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 flex-wrap">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition
                                            ${activeImage === i ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div className="flex flex-col">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.id} — {product.category}</p>
                        <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-3">{product.name}</h1>
                        <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price?.toFixed(2)}</p>

                        {reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">{avgRating} ({reviews.length} reviews)</span>
                            </div>
                        )}

                        <hr className="my-4" />

                        {colors.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold mb-2">
                                    Color: <span className="font-normal">{selectedColor !== null ? colors[selectedColor]?.label : 'Select a color'}</span>
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((c, i) => (
                                        <button key={i} onClick={() => handleColorClick(c, i)} title={c.label}
                                            className={`w-10 h-10 rounded-sm overflow-hidden border-2 transition
                                                ${selectedColor === i ? 'border-black' : 'border-gray-200 hover:border-gray-500'}`}>
                                            {c.imageUrl
                                                ? <img src={c.imageUrl} alt={c.label} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full bg-gray-200" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sizes.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold">Size:</p>
                                    <button className="text-xs text-gray-500 underline">Size chart</button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {sizes.map((size) => (
                                        <button key={size} onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-sm border rounded transition
                                                ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className={`text-sm mb-6 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {product.stock > 10 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Low Stock - Only ${product.stock} left!` : 'Out of Stock'}
                        </p>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full py-4 border-2 font-bold uppercase tracking-widest text-sm transition mb-3 disabled:opacity-40 disabled:cursor-not-allowed
                                ${addedToCart
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-black text-black hover:bg-black hover:text-white'}`}>
                            {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>

                        <button className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mt-2">
                            <Share2 size={15} /> Share
                        </button>

                        <hr className="my-6" />

                        {[
                            { id: 'description', label: 'DESCRIPTION', content: product.description || 'No description available.', isHtml: true },
                            { id: 'material', label: 'MATERIAL', content: 'Details coming soon.' },
                            { id: 'shipping', label: 'SHIPPING & RETURNS', content: 'Free shipping on orders over $50. Returns accepted within 30 days.' },
                            { id: 'faq', label: 'FREQUENTLY ASKED QUESTIONS', content: 'Contact us at (818) 206-8764 for any questions.' },
                        ].map(section => (
                            <div key={section.id} className="border-b border-gray-200">
                                <button
                                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                                    className="w-full flex items-center justify-between py-4 text-sm font-bold tracking-widest text-left">
                                    {section.label}
                                    {openSection === section.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {openSection === section.id && (
                                    section.isHtml
                                        ? <div className="pb-4 text-sm text-gray-600 leading-relaxed rich-content"
                                            dangerouslySetInnerHTML={{ __html: section.content }} />
                                        : <div className="pb-4 text-sm text-gray-600 leading-relaxed">{section.content}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={20} className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">{reviews.length > 0 ? `${avgRating} out of 5 (${reviews.length} reviews)` : 'No reviews yet'}</span>
                        </div>
                        <button onClick={() => setShowReviewForm(!showReviewForm)}
                            className="px-4 py-2 border border-black text-sm font-semibold hover:bg-black hover:text-white transition">
                            Write a review
                        </button>
                    </div>

                    {showReviewForm && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold mb-4">Write a Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Name</label>
                                    <input type="text" value={reviewForm.name}
                                        onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                                        placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} type="button" onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}>
                                                <Star size={24} className={s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Review</label>
                                    <textarea value={reviewForm.comment}
                                        onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                                        placeholder="Share your experience with this product..." />
                                </div>
                                <div className="flex gap-3">
                                    <button type="submit" disabled={submittingReview}
                                        className="px-6 py-2 bg-black text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50">
                                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button type="button" onClick={() => setShowReviewForm(false)}
                                        className="px-6 py-2 border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="flex justify-center mb-3">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} className="text-gray-200 fill-gray-200" />)}
                            </div>
                            <p className="text-gray-500 mb-1">Be the first to write a review</p>
                            <button onClick={() => setShowReviewForm(true)}
                                className="text-sm underline text-gray-600 hover:text-black">write a review</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review, i) => (
                                <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                                {review.name?.[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-sm">{review.name}</span>
                                        </div>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-center mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => {
                                const imgs = (() => { try { return JSON.parse(p.images || '[]'); } catch { return p.imgUrl ? [p.imgUrl] : []; } })();
                                return (
                                    <div key={p.id} onClick={() => navigate(`/products/${p.id}`)}
                                        className="bg-white cursor-pointer group">
                                        <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '3/4' }}>
                                            <img src={imgs[0] || 'https://placehold.co/400x500?text=No+Image'}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                onError={e => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }} />
                                        </div>
                                        <div className="pt-3 pb-4">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{p.category}</p>
                                            <h3 className="text-sm font-semibold uppercase">{p.name}</h3>
                                            <p className="text-sm text-gray-800 mt-1">${p.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;