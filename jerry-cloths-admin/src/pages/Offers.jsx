import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { uploadImage } from '../services/api';

const API_URL = 'http://localhost:8080/api';

const toInputVal = (dt) => {
    if (!dt) return '';
    // LocalDateTime comes as array [y,m,d,h,min] or ISO string
    if (Array.isArray(dt)) {
        const [y, mo, d, h = 0, min = 0] = dt;
        return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}T${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
    }
    return dt.substring(0, 16);
};

const empty = () => ({ title: '', imageUrl: '', startDate: '', endDate: '', uploading: false, saving: false });

const Offers = () => {
    const [offers, setOffers]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [showForm, setShowForm]     = useState(false);
    const [form, setForm]             = useState(empty());
    const [editId, setEditId]         = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => { fetchOffers(); }, []);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/offers`);
            const data = await res.json();
            setOffers(Array.isArray(data) ? data : []);
        } catch { setOffers([]); }
        finally { setLoading(false); }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(f => ({ ...f, uploading: true }));
        const url = await uploadImage(file);
        if (url) setForm(f => ({ ...f, imageUrl: url, uploading: false }));
        else { alert('Image upload failed'); setForm(f => ({ ...f, uploading: false })); }
        e.target.value = '';
    };

    const handleSave = async () => {
        if (!form.imageUrl) { alert('Please upload an image first.'); return; }
        setForm(f => ({ ...f, saving: true }));
        try {
            const payload = {
                title: form.title,
                imageUrl: form.imageUrl,
                startDate: form.startDate ? form.startDate + ':00' : null,
                endDate: form.endDate ? form.endDate + ':00' : null,
            };
            const url    = editId ? `${API_URL}/offers/${editId}` : `${API_URL}/offers`;
            const method = editId ? 'PUT' : 'POST';
            const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error();
            await fetchOffers();
            setShowForm(false);
            setForm(empty());
            setEditId(null);
        } catch { alert('Failed to save offer'); }
        finally { setForm(f => ({ ...f, saving: false })); }
    };

    const handleToggle = async (id) => {
        setTogglingId(id);
        try {
            const res = await fetch(`${API_URL}/offers/${id}/toggle`, { method: 'PUT' });
            if (!res.ok) throw new Error();
            const updated = await res.json();
            setOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: updated.isActive } : o));
        } catch { alert('Failed to update display status'); }
        finally { setTogglingId(null); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        try {
            await fetch(`${API_URL}/offers/${id}`, { method: 'DELETE' });
            setOffers(prev => prev.filter(o => o.id !== id));
        } catch { alert('Failed to delete offer'); }
    };

    const startEdit = (offer) => {
        setEditId(offer.id);
        setForm({
            title: offer.title || '',
            imageUrl: offer.imageUrl || '',
            startDate: toInputVal(offer.startDate),
            endDate: toInputVal(offer.endDate),
            uploading: false,
            saving: false,
        });
        setShowForm(true);
    };

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Offers</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Active offers pop up for first-time visitors. Set a date range to rotate them automatically.
                        </p>
                    </div>
                    <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty()); }}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition">
                        <Plus size={16} /> Add Offer
                    </button>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5 space-y-4">
                        <h2 className="font-semibold text-gray-900">{editId ? 'Edit Offer' : 'New Offer'}</h2>

                        {/* Image upload */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Offer Image</label>
                            {form.imageUrl ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                                    <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                                    <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                        <Upload size={20} className="text-white" />
                                        <input type="file" accept="image/*" className="hidden"
                                            onChange={handleImageUpload} disabled={form.uploading} />
                                    </label>
                                </div>
                            ) : (
                                <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition">
                                    {form.uploading ? <span className="text-sm text-gray-400">Uploading...</span> : (
                                        <><Upload size={22} className="text-gray-400 mb-1.5" />
                                        <span className="text-sm text-gray-400">Click to upload offer image</span></>
                                    )}
                                    <input type="file" accept="image/*" className="hidden"
                                        onChange={handleImageUpload} disabled={form.uploading} />
                                </label>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Title (shown on popup)</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="e.g. Summer Sale — Up to 40% Off"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                        </div>

                        {/* Date range */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Show From</label>
                                <input type="datetime-local" value={form.startDate}
                                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Show Until</label>
                                <input type="datetime-local" value={form.endDate}
                                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Leave dates empty to show this offer indefinitely (until you turn it off).</p>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <button onClick={handleSave} disabled={form.saving || form.uploading}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40">
                                <Save size={14} /> {form.saving ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => { setShowForm(false); setEditId(null); setForm(empty()); }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Offers List */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => <div key={i} className="animate-pulse bg-white rounded-xl h-24 border border-gray-100" />)}
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">No offers yet. Add one above.</div>
                ) : (
                    <div className="space-y-3">
                        {offers.map(offer => (
                            <div key={offer.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                                {/* Thumbnail */}
                                <div className="w-20 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                                    {offer.imageUrl
                                        ? <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-gray-300"><Upload size={16} /></div>}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">{offer.title || 'Untitled offer'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {offer.startDate ? `From ${toInputVal(offer.startDate).replace('T', ' ')}` : 'No start'}
                                        {' → '}
                                        {offer.endDate ? toInputVal(offer.endDate).replace('T', ' ') : 'No end'}
                                    </p>
                                </div>

                                {/* Status badge */}
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0
                                    ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {offer.isActive ? 'Live' : 'Off'}
                                </span>

                                {/* Display toggle button */}
                                <button onClick={() => handleToggle(offer.id)} disabled={togglingId === offer.id}
                                    title={offer.isActive ? 'Turn off display' : 'Display this offer'}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex-shrink-0
                                        ${offer.isActive
                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                        ${togglingId === offer.id ? 'opacity-50' : ''}`}>
                                    {offer.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                    Display
                                </button>

                                {/* Edit */}
                                <button onClick={() => startEdit(offer)}
                                    className="text-xs text-gray-500 hover:text-black font-medium flex-shrink-0 transition">
                                    Edit
                                </button>

                                {/* Delete */}
                                <button onClick={() => handleDelete(offer.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 transition flex-shrink-0">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Offers;