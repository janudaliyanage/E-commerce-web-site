import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

const OfferPopup = () => {
    const [offer, setOffer]     = useState(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Only show once per browser session
        if (sessionStorage.getItem('offerPopupSeen')) return;

        fetch(`${API_URL}/offers/active`)
            .then(r => {
                if (r.status === 204) return null; // no active offer
                return r.json();
            })
            .then(data => {
                if (data && data.id) {
                    setOffer(data);
                    // Small delay so page content loads first
                    setTimeout(() => setVisible(true), 1200);
                }
            })
            .catch(() => {}); // fail silently
    }, []);

    const close = () => {
        setVisible(false);
        sessionStorage.setItem('offerPopupSeen', 'true');
    };

    const handleImageClick = () => {
        close();
        navigate('/category/lookbook');
    };

    if (!visible || !offer) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm relative animate-fadeIn">

                {/* Close button */}
                <button onClick={close}
                    className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition">
                    <X size={16} />
                </button>

                {/* Title */}
                {offer.title && (
                    <div className="px-5 pt-5 pb-3">
                        <p className="font-bold text-xl text-gray-900 tracking-tight">{offer.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Click image to explore the collection →</p>
                    </div>
                )}

                {/* Offer image — clicking goes to lookbook/offers section */}
                {offer.imageUrl && (
                    <img src={offer.imageUrl} alt={offer.title || 'Offer'}
                        onClick={handleImageClick}
                        className="w-full object-cover cursor-pointer hover:opacity-95 transition"
                        style={{ maxHeight: '380px' }} />
                )}

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-4">
                    <button onClick={handleImageClick}
                        className="px-4 py-2 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition rounded-lg">
                        Shop Now
                    </button>
                    <button onClick={close} className="text-sm text-gray-400 hover:text-gray-700 transition">
                        Maybe later
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OfferPopup;