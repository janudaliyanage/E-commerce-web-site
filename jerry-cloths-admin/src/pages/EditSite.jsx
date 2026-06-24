import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, Trash2, Plus, GripVertical, Search, Package, X, Link as LinkIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { uploadImage, fetchAllProducts } from '../services/api';

const API_URL = 'http://localhost:8080/api';

// Must match the dropdown keys in jerry-cloths-frontend/src/components/Navbar.jsx
// (LOOKBOOK is excluded there too — it has no featured image)
const NAV_CATEGORIES = ['FOR HIM', 'FOR HER', 'NEW DROP', 'COLLABS'];

const EditSite = () => {
    const [activeTab, setActiveTab] = useState('banners');
    const [banners, setBanners] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [dragIndex, setDragIndex] = useState(null);

    // Products for the banner link picker
    const [allProducts, setAllProducts] = useState([]);
    // picker: { open: false } | { open: true, bannerIndex: N }
    const [picker, setPicker] = useState({ open: false, bannerIndex: null });
    const [pickerQuery, setPickerQuery] = useState('');
    const [pickerMode, setPickerMode] = useState('product'); // 'product' | 'custom'
    const [customLink, setCustomLink] = useState('');
    const pickerRef = useRef(null);

    // Close picker on outside click
    useEffect(() => {
        const handler = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setPicker({ open: false, bannerIndex: null });
            }
        };
        if (picker.open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [picker.open]);

    const openPicker = (index) => {
        const current = banners[index]?.link || '';
        // Detect if current link is a custom one (not a /products/ link)
        const isCustom = current && !current.startsWith('/products/');
        setPickerMode(isCustom ? 'custom' : 'product');
        setCustomLink(isCustom ? current : '');
        setPickerQuery('');
        setPicker({ open: true, bannerIndex: index });
    };

    const applyProductLink = (product) => {
        const link = `/products/${product.id}`;
        handleLinkChange(picker.bannerIndex, link);
        setPicker({ open: false, bannerIndex: null });
    };

    const applyCustomLink = () => {
        handleLinkChange(picker.bannerIndex, customLink.trim());
        setPicker({ open: false, bannerIndex: null });
    };

    const filteredProducts = allProducts.filter(p =>
        p.name?.toLowerCase().includes(pickerQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(pickerQuery.toLowerCase())
    );

    // Inline ProductPicker component rendered as a modal overlay
    const ProductPicker = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-40">
            <div ref={pickerRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '75vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Link this banner to…</h3>
                    <button onClick={() => setPicker({ open: false })} className="p-1 hover:bg-gray-100 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                {/* Mode tabs */}
                <div className="flex border-b border-gray-100">
                    <button onClick={() => setPickerMode('product')}
                        className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition
                            ${pickerMode === 'product' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Package size={14} /> Pick a Product
                    </button>
                    <button onClick={() => setPickerMode('custom')}
                        className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition
                            ${pickerMode === 'custom' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                        <LinkIcon size={14} /> Custom URL
                    </button>
                </div>

                {pickerMode === 'product' ? (
                    <>
                        {/* Search */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                <Search size={14} className="text-gray-400" />
                                <input autoFocus value={pickerQuery} onChange={e => setPickerQuery(e.target.value)}
                                    placeholder="Search products by name or category..."
                                    className="flex-1 text-sm bg-transparent focus:outline-none" />
                            </div>
                        </div>

                        {/* Product list */}
                        <div className="overflow-y-auto flex-1 py-2">
                            {filteredProducts.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-8">No products found</p>
                            ) : filteredProducts.map(product => {
                                let images = [];
                                try { images = JSON.parse(product.images || '[]'); } catch { }
                                const thumb = images[0] || null;
                                return (
                                    <button key={product.id} onClick={() => applyProductLink(product)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left">
                                        {/* Thumbnail */}
                                        <div className="w-12 h-12 rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden">
                                            {thumb
                                                ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                                                : <Package size={20} className="m-auto mt-3 text-gray-300" />}
                                        </div>
                                        {/* Info */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-400">
                                                ${Number(product.price).toFixed(2)}
                                                {product.category && <span className="ml-1.5">· {product.category}</span>}
                                            </p>
                                        </div>
                                        {/* Link preview */}
                                        <span className="ml-auto text-xs text-gray-300 font-mono flex-shrink-0">
                                            /products/{product.id}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    /* Custom URL mode */
                    <div className="px-5 py-5 space-y-3">
                        <p className="text-sm text-gray-500">Use this for category pages, sale pages, or any custom route.</p>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">URL path</label>
                            <input autoFocus value={customLink} onChange={e => setCustomLink(e.target.value)}
                                placeholder="e.g. /category/for-him  or  /info/our-story"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                        </div>
                        <div className="flex gap-2 pt-1 text-xs text-gray-400">
                            {['/category/for-him', '/category/for-her', '/info/our-story', '/products'].map(ex => (
                                <button key={ex} onClick={() => setCustomLink(ex)}
                                    className="px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                                    {ex}
                                </button>
                            ))}
                        </div>
                        <button onClick={applyCustomLink} disabled={!customLink.trim()}
                            className="w-full py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40">
                            Apply Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // navImages: { 'FOR HIM': { imageUrl, caption, uploading, saving }, ... }
    const emptyNavImages = () =>
        NAV_CATEGORIES.reduce((acc, cat) => {
            acc[cat] = { imageUrl: '', caption: '', uploading: false, saving: false };
            return acc;
        }, {});
    const [navImages, setNavImages] = useState(emptyNavImages());
    const [loadingNavImages, setLoadingNavImages] = useState(true);

    useEffect(() => {
        fetchBanners();
        fetchNavImages();
        fetchAllProducts().then(data => setAllProducts(Array.isArray(data) ? data : []));
    }, []);

    const fetchNavImages = async () => {
        setLoadingNavImages(true);
        try {
            const res = await fetch(`${API_URL}/nav-images`);
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error('Unexpected response shape');
            setNavImages(prev => {
                const next = { ...prev };
                data.forEach(row => {
                    if (next[row.category]) {
                        next[row.category] = {
                            ...next[row.category],
                            imageUrl: row.imageUrl || '',
                            caption: row.caption || '',
                        };
                    }
                });
                return next;
            });
        } catch (err) {
            console.error('Failed to fetch navbar images:', err.message);
        } finally {
            setLoadingNavImages(false);
        }
    };

    const handleNavImageUpload = async (e, category) => {
        const file = e.target.files[0];
        if (!file) return;
        setNavImages(prev => ({ ...prev, [category]: { ...prev[category], uploading: true } }));
        const url = await uploadImage(file);
        if (url) {
            setNavImages(prev => ({ ...prev, [category]: { ...prev[category], imageUrl: url, uploading: false } }));
        } else {
            alert('Failed to upload image');
            setNavImages(prev => ({ ...prev, [category]: { ...prev[category], uploading: false } }));
        }
        e.target.value = '';
    };

    const handleNavCaptionChange = (category, value) => {
        setNavImages(prev => ({ ...prev, [category]: { ...prev[category], caption: value } }));
    };

    const saveNavImage = async (category) => {
        const entry = navImages[category];
        setNavImages(prev => ({ ...prev, [category]: { ...prev[category], saving: true } }));
        try {
            const res = await fetch(`${API_URL}/nav-images/${encodeURIComponent(category)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: entry.imageUrl, caption: entry.caption }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ''}`);
            }
            const saved = await res.json();
            setNavImages(prev => ({
                ...prev,
                [category]: { ...prev[category], imageUrl: saved.imageUrl || '', caption: saved.caption || '', saving: false },
            }));
        } catch (err) {
            console.error('Failed to save navbar image:', err);
            alert(`Failed to save navbar image:\n${err.message}`);
            setNavImages(prev => ({ ...prev, [category]: { ...prev[category], saving: false } }));
        }
    };

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
        <>
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
                                                    <button onClick={() => openPicker(index)}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left hover:border-black transition flex items-center gap-2">
                                                        {banner.link ? (
                                                            <>
                                                                <LinkIcon size={13} className="text-gray-400 flex-shrink-0" />
                                                                <span className="text-gray-800 truncate">{banner.link}</span>
                                                                <span className="ml-auto text-xs text-gray-400 flex-shrink-0">Change</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Package size={13} className="text-gray-300 flex-shrink-0" />
                                                                <span className="text-gray-400">Pick a product or URL…</span>
                                                            </>
                                                        )}
                                                    </button>
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
                        <div className="space-y-4 max-w-3xl">
                            <div className="mb-2">
                                <h2 className="font-semibold text-lg">Navbar Dropdown Images</h2>
                                <p className="text-sm text-gray-500">
                                    Each menu (FOR HIM, FOR HER, NEW DROP, COLLABS) shows a featured image on the right
                                    side of its dropdown. Upload an image and caption for each below.
                                </p>
                            </div>

                            {loadingNavImages ? (
                                <div className="text-center py-8 text-gray-400">Loading navbar images...</div>
                            ) : (
                                NAV_CATEGORIES.map(category => {
                                    const entry = navImages[category];
                                    return (
                                        <div key={category} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                            <div className="flex items-start gap-4">
                                                {/* Image */}
                                                <div className="flex-shrink-0">
                                                    {entry.imageUrl ? (
                                                        <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                                            <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
                                                            <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                                                <Upload size={18} className="text-white" />
                                                                <input type="file" accept="image/*" className="hidden"
                                                                    onChange={(e) => handleNavImageUpload(e, category)}
                                                                    disabled={entry.uploading} />
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <label className="w-40 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition bg-white">
                                                            {entry.uploading ? (
                                                                <span className="text-xs text-gray-400">Uploading...</span>
                                                            ) : (
                                                                <>
                                                                    <Upload size={20} className="text-gray-400 mb-1" />
                                                                    <span className="text-xs text-gray-400">Upload Image</span>
                                                                </>
                                                            )}
                                                            <input type="file" accept="image/*" className="hidden"
                                                                onChange={(e) => handleNavImageUpload(e, category)}
                                                                disabled={entry.uploading} />
                                                        </label>
                                                    )}
                                                </div>

                                                {/* Caption + Save */}
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Caption (shown under the image)</label>
                                                        <input type="text" value={entry.caption}
                                                            onChange={(e) => handleNavCaptionChange(category, e.target.value)}
                                                            placeholder="e.g. MEN'S NEW DROP"
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                                                    </div>
                                                    <button onClick={() => saveNavImage(category)}
                                                        disabled={!entry.imageUrl || entry.saving || entry.uploading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition disabled:opacity-40">
                                                        <Save size={13} />
                                                        {entry.saving ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>

                                                {/* Category label */}
                                                <div className="flex-shrink-0 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                    {category}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </AdminLayout>
            {picker.open && <ProductPicker />}
        </>
    );
};

export default EditSite;