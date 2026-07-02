import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api';

const OffersPage = () => {
    const [offers, setOffers]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/offers`)
            .then(r => r.json())
            .then(data => {
                const now = new Date();
                const active = Array.isArray(data) ? data.filter(o => {
                    if (!o.isActive) return false;
                    if (o.startDate && new Date(o.startDate) > now) return false;
                    if (o.endDate   && new Date(o.endDate)   < now) return false;
                    return true;
                }) : [];
                setOffers(active);
            })
            .catch(() => setOffers([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Lookbook</p>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Current Offers</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl" style={{ height: 400 }} />
                        ))}
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg">No active offers right now.</p>
                        <p className="text-sm mt-1">Check back soon!</p>
                    </div>
                ) : (
                    <div className={`grid gap-6 ${offers.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {offers.map(offer => (
                            <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                                {offer.imageUrl && (
                                    <div className="overflow-hidden">
                                        <img src={offer.imageUrl} alt={offer.title || 'Offer'}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            style={{ maxHeight: '480px' }} />
                                    </div>
                                )}
                                {offer.title && (
                                    <div className="px-6 py-4">
                                        <h2 className="text-xl font-bold text-gray-900">{offer.title}</h2>
                                        {offer.endDate && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                Ends {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersPage;