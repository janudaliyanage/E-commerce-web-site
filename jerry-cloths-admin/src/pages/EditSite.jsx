import React, { useState, useEffect } from 'react';
import { Upload, Save, Trash2, Plus, GripVertical } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { uploadImage } from '../services/api';

const API_URL = 'http://localhost:8080/api';

const EditSite = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [dragIndex, setDragIndex] = useState(null);

    useEffect(() => { fetchBanners(); }, []);

    const fetchBanners = async () => {
        setLoadingBanners(true);
        try {
            const res = await fetch(`${API_URL}/banners`);
            const data = await res.json();
            setBanners(data);
        } catch (err) {
            console.error('Failed to fetch banners');
        } finally {
            setLoadingBanners(false);
        }
    };

    const handleBannerImageUpload = async (e, index) => {
        const file = e.target.files[0];
        if (!file) return;
        setBanners(prev => prev.map((b, i) => i === index ? { ...b, uploading: true } : b));
        const url = await uploadImage(file);
        if (url) {
            setBanners(prev => prev.map((b, i) => i === index ? { ...b, imageUrl: url, uploading: false } : b));
        } else {
            alert('Failed to upload image');
            setBanners(prev => prev.map((b, i) => i === index ? { ...b, uploading: false } : b));
        }
        e.target.value = '';
    };

    const handleLinkChange = (index, value) => {
        setBanners(prev => prev.map((b, i) => i === index ? { ...b, link: value } : b));
    };

    const addBanner = () => {
        setBanners(prev => [...prev, { id: null, imageUrl: '', link: '', displayOrder: prev.length, uploading: false, isNew: true }]);
    };

    const saveBanner = async (banner, index) => {
        try {
            setBanners(prev => prev.map((b, i) => i === index ? { ...b, saving: true } : b));
            const payload = { imageUrl: banner.imageUrl, link: banner.link, displayOrder: index };
            let res;
            if (banner.id) {
                res = await fetch(`${API_URL}/banners/${banner.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API_URL}/banners`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }
            const saved = await res.json();
            setBanners(prev => prev.map((b, i) => i === index ? { ...saved, saving: false } : b));
        } catch (err) {
            alert('Failed to save banner');
            setBanners(prev => prev.map((b, i) => i === index ? { ...b, saving: false } : b));
        }
    };

    const deleteBanner = async (banner, index) => {
        if (banner.id) {
            await fetch(`${API_URL}/banners/${banner.id}`, { method: 'DELETE' });
        }
        setBanners(prev => prev.filter((_, i) => i !== index));
    };

    // Drag to reorder
    const onDragStart = (index) => setDragIndex(index);
    const onDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        const newBanners = [...banners];
        const [moved] = newBanners.splice(dragIndex, 1);
        newBanners.splice(index, 0, moved);
        setBanners(newBanners);
        setDragIndex(index);
    };
    const onDragEnd = () => setDragIndex(null);

    const tabs = [
        { id: 'banners', label: 'Hero Banners' },
        { id: 'navbar', label: 'Navbar' },
    ];

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Website</h1>
                    <p className="text-gray-500 mt-1">Customize your storefront appearance.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px
                ${activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Hero Banners Tab */}
                {activeTab === 'banners' && (
                    <div className="space-y-4 max-w-3xl">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h2 className="font-semibold text-lg">Hero Banners</h2>
                                <p className="text-sm text-gray-500">Upload banner images with links. Drag to reorder.</p>
                            </div>
                            <button onClick={addBanner}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                                <Plus size={16} /> Add Banner
                            </button>
                        </div>

                        {loadingBanners ? (
                            <div className="text-center py-8 text-gray-400">Loading banners...</div>
                        ) : banners.length === 0 ? (
                            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                                <p className="text-gray-400 mb-4">No banners yet</p>
                                <button onClick={addBanner}
                                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm mx-auto">
                                    <Plus size={16} /> Add First Banner
                                </button>
                            </div>
                        ) : (
                            banners.map((banner, index) => (
                                <div key={index}
                                    draggable
                                    onDragStart={() => onDragStart(index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDragEnd={onDragEnd}
                                    className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4
                    ${dragIndex === index ? 'opacity-50' : ''}`}>
                                    <div className="flex items-start gap-4">
                                        {/* Drag Handle */}
                                        <div className="cursor-grab mt-2 text-gray-400">
                                            <GripVertical size={20} />
                                        </div>

                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            {banner.imageUrl ? (
                                                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                                                    <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                                        <Upload size={18} className="text-white" />
                                                        <input type="file" accept="image/*" className="hidden"
                                                            onChange={(e) => handleBannerImageUpload(e, index)}
                                                            disabled={banner.uploading} />
                                                    </label>
                                                </div>
                                            ) : (
                                                <label className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition bg-white">
                                                    {banner.uploading ? (
                                                        <span className="text-xs text-gray-400">Uploading...</span>
                                                    ) : (
                                                        <>
                                                            <Upload size={20} className="text-gray-400 mb-1" />
                                                            <span className="text-xs text-gray-400">Upload Image</span>
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" className="hidden"
                                                        onChange={(e) => handleBannerImageUpload(e, index)}
                                                        disabled={banner.uploading} />
                                                </label>
                                            )}
                                        </div>

                                        {/* Link + Actions */}
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Link (where to go when clicked)</label>
                                                <input type="text" value={banner.link || ''}
                                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                                    placeholder="e.g. /products/30 or /category/for-him"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => saveBanner(banner, index)}
                                                    disabled={!banner.imageUrl || banner.saving || banner.uploading}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition disabled:opacity-40">
                                                    <Save size={13} />
                                                    {banner.saving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button onClick={() => deleteBanner(banner, index)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order badge */}
                                        <div className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                            {index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Navbar Tab */}
                {activeTab === 'navbar' && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-2xl">
                        <h2 className="font-semibold text-lg">Navbar Settings</h2>
                        <p className="text-sm text-gray-400">Navbar customization coming soon.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default EditSite;