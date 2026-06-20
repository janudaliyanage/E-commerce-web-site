import React, { useState } from 'react';
import { X, ArrowLeft, Star, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const FIT_OPTIONS = ['Too small', 'Somewhat small', 'True to size', 'Somewhat large', 'Too large'];

const ReviewWizard = ({ productId, itemType, onClose, onSubmitted }) => {
    const [step, setStep] = useState(1); // 1 rating, 2 photos, 3 fit, 4 comment
    const [direction, setDirection] = useState('forward');
    const totalSteps = 4;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [images, setImages] = useState([]); // [{url, uploading}]
    const [fitFeedback, setFitFeedback] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [discountCode, setDiscountCode] = useState(null);
    const [closing, setClosing] = useState(false);
    const [entering, setEntering] = useState(true);

    const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0] || 'Anonymous';
    const userId = localStorage.getItem('userId');

    React.useEffect(() => {
        const t = setTimeout(() => setEntering(false), 20);
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t);
            document.body.style.overflow = '';
        };
    }, []);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 200);
    };

    const goNext = () => { setDirection('forward'); setStep(s => Math.min(s + 1, totalSteps)); };
    const goBack = () => { setDirection('back'); setStep(s => Math.max(s - 1, 1)); };

    const hasUploadedImage = images.some(i => i.url);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            const tempId = Date.now() + Math.random();
            setImages(prev => [...prev, { url: null, uploading: true, tempId }]);
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch(`${API_URL}/upload/image`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    setImages(prev => prev.map(img => img.tempId === tempId ? { url: data.imageUrl, uploading: false, tempId } : img));
                } else {
                    setImages(prev => prev.filter(img => img.tempId !== tempId));
                }
            } catch {
                setImages(prev => prev.filter(img => img.tempId !== tempId));
            }
        }
        e.target.value = '';
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const uploadedUrls = images.filter(i => i.url).map(i => i.url);

            const reviewPayload = {
                productId: parseInt(productId),
                userId: userId ? parseInt(userId) : null,
                name: userName,
                rating,
                comment,
                fitFeedback,
                images: JSON.stringify(uploadedUrls),
                itemType: itemType || null,
            };

            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewPayload),
            });

            if (!res.ok) throw new Error('Failed to submit review');
            const savedReview = await res.json();

            if (uploadedUrls.length > 0) {
                const codeRes = await fetch(`${API_URL}/discount-codes/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });
                if (codeRes.ok) {
                    const codeData = await codeRes.json();
                    setDiscountCode(codeData.code);
                }
            }

            onSubmitted?.(savedReview);

            if (uploadedUrls.length === 0) {
                handleClose();
            }
        } catch (err) {
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const ProgressBar = () => (
        <div className="flex gap-2 flex-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < step ? 'bg-black' : 'bg-gray-200'}`} />
            ))}
        </div>
    );

    return (
        <div className={`fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black z-[100] flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200
      ${closing || entering ? 'bg-opacity-0' : 'bg-opacity-50'}`}>
            <div className={`bg-white rounded-2xl w-full max-w-lg relative shadow-2xl transition-all duration-200 ease-out my-auto
        ${closing || entering ? 'opacity-0 scale-95 translate-y-3' : 'opacity-100 scale-100 translate-y-0'}`}>

                <button onClick={handleClose} className="absolute top-5 left-5 p-1 hover:bg-gray-100 rounded-full transition z-10">
                    <X size={22} />
                </button>

                <div className="px-8 pt-16 pb-8 min-h-[420px] flex flex-col overflow-hidden relative">

                    <div
                        key={step}
                        className="flex-1 flex flex-col animate-stepIn"
                    >
                        {/* Step 1: Rating */}
                        {step === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <h2 className="text-xl font-bold mb-8">How would you rate this item?</h2>
                                <div className="flex gap-2 mb-3">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s}
                                            onMouseEnter={() => setHoverRating(s)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => { setRating(s); goNext(); }}
                                            className="transition-transform duration-150 hover:scale-110 active:scale-95">
                                            <Star size={40}
                                                className={`transition-colors duration-150 ${(hoverRating || rating) >= s ? 'fill-black text-black' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between w-full text-sm text-gray-400 px-2 mt-2">
                                    <span>Dislike it</span>
                                    <span>Love it!</span>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Photos */}
                        {step === 2 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center">
                                <h2 className="text-xl font-bold mb-1">Show it off</h2>
                                <p className="text-gray-500 mb-6">We'd love to see it in action!</p>

                                <div className="border border-gray-200 rounded-xl p-5 w-full">
                                    <p className="font-semibold mb-4">Get 15% off your next purchase</p>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition">
                                            <ImageIcon size={18} /> Add photos
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                        </label>
                                        <button disabled
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-300 text-white rounded-lg font-semibold cursor-not-allowed">
                                            <Video size={18} /> Add video
                                        </button>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                            {images.map(img => (
                                                <div key={img.tempId} className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border animate-fadeIn">
                                                    {img.uploading
                                                        ? <div className="w-full h-full flex items-center justify-center"><Loader2 size={16} className="animate-spin text-gray-400" /></div>
                                                        : <img src={img.url} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Fit */}
                        {step === 3 && (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold mb-8 text-center">How did it fit?</h2>
                                <div className="space-y-3 w-full">
                                    {FIT_OPTIONS.map(option => (
                                        <button key={option}
                                            onClick={() => { setFitFeedback(option); goNext(); }}
                                            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-150 text-left hover:scale-[1.02] active:scale-[0.98]
                        ${fitFeedback === option ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>
                                            <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                        ${fitFeedback === option ? 'border-white bg-white' : 'border-gray-400'}`} />
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Comment */}
                        {step === 4 && (
                            <div className="flex-1 flex flex-col">
                                <h2 className="text-xl font-bold mb-6 text-center">Tell us more!</h2>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Share your experience"
                                    rows={8}
                                    autoFocus
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none flex-1 transition-colors"
                                />
                            </div>
                        )}
                    </div>

                    {/* Discount code success screen */}
                    {discountCode && (
                        <div className="absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center text-center p-8 animate-fadeIn">
                            <div className="text-4xl mb-4">🎉</div>
                            <h2 className="text-xl font-bold mb-2">Thanks for your review!</h2>
                            <p className="text-gray-500 mb-6">Here's your 15% off code:</p>
                            <div className="bg-gray-100 rounded-lg px-6 py-3 font-mono font-bold text-lg tracking-wider mb-6">
                                {discountCode}
                            </div>
                            <button onClick={handleClose} className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer: Back / Progress / Next */}
                {!discountCode && (
                    <div className="flex items-center gap-4 px-8 py-5 border-t border-gray-100">
                        {step > 1 ? (
                            <button onClick={goBack} className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black transition">
                                <ArrowLeft size={16} /> Back
                            </button>
                        ) : <div className="w-12" />}

                        <ProgressBar />

                        {step === 2 && (
                            hasUploadedImage ? (
                                <button onClick={goNext}
                                    className="px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                                    Next
                                </button>
                            ) : (
                                <button onClick={goNext} className="text-sm font-semibold text-gray-500 hover:text-black transition">Skip</button>
                            )
                        )}
                        {step === 4 && (
                            <button onClick={handleSubmit} disabled={submitting || !comment.trim()}
                                className="px-5 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40">
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(${direction === 'forward' ? '16px' : '-16px'}); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-stepIn {
          animation: stepIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
        </div>
    );
};

export default ReviewWizard;