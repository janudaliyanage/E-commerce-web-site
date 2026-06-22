import React, { useState, useEffect } from 'react';
import { Send, Users, Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { fetchAllProducts } from '../services/api';

const API_URL = 'http://localhost:8080/api';

const Newsletter = () => {
    const [subscriberCount, setSubscriberCount] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [productId, setProductId] = useState('');
    const [sending, setSending] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [subsRes, campaignsRes, productList] = await Promise.all([
                fetch(`${API_URL}/newsletter/subscribers`).then(r => r.json()),
                fetch(`${API_URL}/newsletter/campaigns`).then(r => r.json()),
                fetchAllProducts(),
            ]);
            setSubscriberCount(Array.isArray(subsRes) ? subsRes.length : 0);
            setCampaigns(Array.isArray(campaignsRes) ? campaignsRes : []);
            setProducts(Array.isArray(productList) ? productList : []);
        } catch (err) {
            console.error('Failed to load newsletter data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !body.trim()) return;
        setSending(true);
        setLastResult(null);
        try {
            const res = await fetch(`${API_URL}/newsletter/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    body,
                    productId: productId || null,
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const campaign = await res.json();
            setLastResult(campaign);
            setCampaigns(prev => [campaign, ...prev]);
            setSubject('');
            setBody('');
            setProductId('');
        } catch (err) {
            alert(`Failed to send: ${err.message}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8 max-w-3xl">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-xl font-bold text-gray-900">Newsletter</h1>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Users size={15} />
                        {loading ? '...' : `${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'}`}
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    Write a letter to everyone who's subscribed for new-drop notifications. Optionally feature one product.
                </p>

                {/* Compose */}
                <form onSubmit={handleSend} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                        <input value={subject} onChange={e => setSubject(e.target.value)}
                            placeholder="e.g. New drop just landed 🔥"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={6}
                            placeholder="Write your letter to subscribers..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Feature a product (optional)</label>
                        <select value={productId} onChange={e => setProductId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black bg-white">
                            <option value="">None</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} — ${p.price?.toFixed(2)}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-1">
                            If selected, the product name, price, and link are appended to the email automatically.
                        </p>
                    </div>
                    <button type="submit" disabled={sending || !subject.trim() || !body.trim()}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40">
                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {sending ? 'Sending...' : `Send to ${subscriberCount ?? '...'} subscriber${subscriberCount === 1 ? '' : 's'}`}
                    </button>
                </form>

                {/* Last result banner */}
                {lastResult && (
                    <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 text-sm
            ${lastResult.delivered ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                        {lastResult.delivered
                            ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                            : <XCircle size={18} className="flex-shrink-0 mt-0.5" />}
                        <div>
                            <p className="font-semibold">
                                {lastResult.delivered
                                    ? `Sent to ${lastResult.recipientCount} subscriber${lastResult.recipientCount === 1 ? '' : 's'}`
                                    : 'Saved, but not delivered'}
                            </p>
                            {!lastResult.delivered && lastResult.failureReason && (
                                <p className="mt-0.5">{lastResult.failureReason}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* History */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                        <Mail size={15} /> Past Letters
                    </h2>
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : campaigns.length === 0 ? (
                        <p className="text-sm text-gray-400">No letters sent yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {campaigns.map(c => (
                                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{c.subject}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {c.sentAt ? new Date(c.sentAt).toLocaleString() : ''} · {c.recipientCount} recipient{c.recipientCount === 1 ? '' : 's'}
                                            </p>
                                        </div>
                                        <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full
                      ${c.delivered ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {c.delivered ? 'Delivered' : 'Not delivered'}
                                        </span>
                                    </div>
                                    {!c.delivered && c.failureReason && (
                                        <p className="text-xs text-amber-700 mt-2">{c.failureReason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Newsletter;