import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, BarChart2,
    Tag, Layers, MessageSquare, Settings, LogOut, Menu, X, ChevronRight, Mail
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Edit Site', icon: Settings, path: '/admin/edit' },
    { label: 'Products', icon: Package, path: '/admin/products' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { label: 'Sales', icon: BarChart2, path: '/admin/sales' },
    { label: 'Offers', icon: Tag, path: '/admin/offers' },
    { label: 'Stock', icon: Layers, path: '/admin/stock' },
    { label: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
    { label: 'Messages', icon: MessageSquare, path: '/admin/messages' },
];

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@jerrycloths.com';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        navigate('/admin/login');
    };

    const Sidebar = ({ mobile }) => (
        <div className={`flex flex-col h-full bg-white border-r border-gray-100 ${mobile ? 'w-full' : 'w-64'}`}>
            {/* Logo */}
            <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">J</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Jerry Cloths</p>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ label, icon: Icon, path }) => {
                    const active = location.pathname === path || (path !== '/admin/dashboard' && location.pathname.startsWith(path));
                    return (
                        <Link key={path} to={path}
                            onClick={() => mobile && setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                            <Icon size={18} />
                            <span>{label}</span>
                            {active && <ChevronRight size={14} className="ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">{adminEmail[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{adminEmail}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                </div>
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar (mobile only) */}
                <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu size={22} className="text-gray-700" />
                    </button>
                    <span className="font-bold text-gray-900">Jerry Cloths Admin</span>
                    <div className="w-6" />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;