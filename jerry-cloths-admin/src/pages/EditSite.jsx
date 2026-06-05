import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { uploadImage } from '../services/api';
import { Upload, Save, Eye, Package } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const EditSite = () => {
    const [activeTab, setActiveTab] = useState('navbar');

    // Navbar state
    const [navbarData, setNavbarData] = useState({
        logo: '',
        logoText: 'JERRY CLOTHS',
        phone: '(818) 206-8764',
        logoFile: null,
        uploading: false,
    });

    // Hero state
    const [heroData, setHeroData] = useState({
        heading: "JERRY'S GYM",
        subheading: 'NEW DROP',
        buttonText: 'SHOP NOW',
        backgroundImage: '',
        uploading: false,
    });

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState('');

    const handleNavbarImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setNavbarData(prev => ({ ...prev, uploading: true }));
        const url = await uploadImage(file);
        if (url) setNavbarData(prev => ({ ...prev, logo: url, uploading: false }));
        else {
            alert('Failed to upload logo');
            setNavbarData(prev => ({ ...prev, uploading: false }));
        }
    };

    const handleHeroBgUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setHeroData(prev => ({ ...prev, uploading: true }));
        const url = await uploadImage(file);
        if (url) setHeroData(prev => ({ ...prev, backgroundImage: url, uploading: false }));
        else {
            alert('Failed to upload image');
            setHeroData(prev => ({ ...prev, uploading: false }));
        }
    };

    const handleSave = async (section) => {
        setSaving(true);
        try {
            const payload = section === 'navbar' ? navbarData : heroData;
            await fetch(`${API_URL}/site-settings/${section}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setSaved(section);
            setTimeout(() => setSaved(''), 2000);
        } catch (err) {
            alert('Failed to save. Backend endpoint not set up yet.');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'navbar', label: 'Navbar' },
        { id: 'hero', label: 'Hero / Welcome' },
        { id: 'products', label: 'Products Section' },
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

                {/* Navbar Tab */}
                {activeTab === 'navbar' && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-2xl">
                        <h2 className="font-semibold text-lg">Navbar Settings</h2>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Logo Image</label>
                            <div className="flex items-center gap-4">
                                {navbarData.logo ? (
                                    <img src={navbarData.logo} alt="logo" className="h-12 object-contain border rounded-lg p-1" />
                                ) : (
                                    <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No logo</div>
                                )}
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                                    <Upload size={16} />
                                    {navbarData.uploading ? 'Uploading...' : 'Upload Logo'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleNavbarImageUpload} disabled={navbarData.uploading} />
                                </label>
                            </div>
                        </div>

                        {/* Logo Text */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Logo Text (shown if no image)</label>
                            <input type="text" value={navbarData.logoText}
                                onChange={e => setNavbarData(prev => ({ ...prev, logoText: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input type="text" value={navbarData.phone}
                                onChange={e => setNavbarData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                placeholder="(818) 206-8764" />
                        </div>

                        <button onClick={() => handleSave('navbar')} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                            <Save size={16} />
                            {saved === 'navbar' ? 'Saved!' : saving ? 'Saving...' : 'Save Navbar'}
                        </button>
                    </div>
                )}

                {/* Hero Tab */}
                {activeTab === 'hero' && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-2xl">
                        <h2 className="font-semibold text-lg">Hero / Welcome Section</h2>

                        {/* Background Image */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Background Image</label>
                            <div className="space-y-3">
                                {heroData.backgroundImage && (
                                    <div className="relative rounded-xl overflow-hidden h-40">
                                        <img src={heroData.backgroundImage} alt="hero bg" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">Preview</span>
                                        </div>
                                    </div>
                                )}
                                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition w-fit">
                                    <Upload size={16} />
                                    {heroData.uploading ? 'Uploading...' : 'Upload Background'}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroBgUpload} disabled={heroData.uploading} />
                                </label>
                            </div>
                        </div>

                        {/* Heading */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Main Heading</label>
                            <input type="text" value={heroData.heading}
                                onChange={e => setHeroData(prev => ({ ...prev, heading: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                placeholder="JERRY'S GYM" />
                        </div>

                        {/* Subheading */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Subheading</label>
                            <input type="text" value={heroData.subheading}
                                onChange={e => setHeroData(prev => ({ ...prev, subheading: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                placeholder="NEW DROP" />
                        </div>

                        {/* Button Text */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Button Text</label>
                            <input type="text" value={heroData.buttonText}
                                onChange={e => setHeroData(prev => ({ ...prev, buttonText: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                placeholder="SHOP NOW" />
                        </div>

                        {/* Live Preview */}
                        {(heroData.backgroundImage || heroData.heading) && (
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                                    <Eye size={14} /> Live Preview
                                </div>
                                <div className="relative rounded-xl overflow-hidden h-40"
                                    style={{ backgroundImage: heroData.backgroundImage ? `url(${heroData.backgroundImage})` : 'linear-gradient(135deg, #1a1a1a, #333)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-center p-4">
                                        <h2 className="text-2xl font-bold text-yellow-400">{heroData.heading}</h2>
                                        <p className="text-lg font-semibold mt-1">{heroData.subheading}</p>
                                        <button className="mt-3 px-4 py-1.5 bg-white text-black text-xs font-bold rounded">{heroData.buttonText}</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button onClick={() => handleSave('hero')} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                            <Save size={16} />
                            {saved === 'hero' ? 'Saved!' : saving ? 'Saving...' : 'Save Hero Section'}
                        </button>
                    </div>
                )}

                {/* Products Section Tab */}
                {activeTab === 'products' && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
                        <h2 className="font-semibold text-lg mb-4">Products Section</h2>
                        <p className="text-gray-500 text-sm mb-4">Manage products directly from the Products page.</p>
                        <a href="/admin/products"
                            className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
                            <Package size={16} /> Go to Products
                        </a>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default EditSite;