import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Package } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API_URL = 'http://localhost:8080/api';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
        {status}
    </span>
);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders`);
            const data = await res.json();
            // newest first
            const sorted = Array.isArray(data)
                ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                : [];
            setOrders(sorted);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error();
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch {
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const parseItems = (itemsJson) => {
        try { return JSON.parse(itemsJson || '[]'); } catch { return []; }
    };

    const filtered = orders.filter(o => {
        const matchSearch = !search ||
            String(o.id).includes(search) ||
            (o.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.shippingAddress || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // Summary counts
    const counts = STATUSES.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Orders</h1>
                    <span className="text-sm text-gray-400">{orders.length} total</span>
                </div>

                {/* Status Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {STATUSES.map(s => (
                        <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                            className={`rounded-xl border p-3 text-left transition
                                ${filterStatus === s ? 'ring-2 ring-black' : 'hover:border-gray-300'}
                                ${STATUS_STYLES[s]}`}>
                            <p className="text-lg font-bold">{counts[s] || 0}</p>
                            <p className="text-xs capitalize font-medium">{s}</p>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-white mb-4 max-w-sm">
                    <Search size={15} className="text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by order #, email, address..."
                        className="flex-1 text-sm focus:outline-none" />
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-xl h-20 border border-gray-100" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Package size={36} className="mx-auto mb-3 opacity-30" />
                        <p>{orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filtered.map(order => {
                            const items = parseItems(order.items);
                            const isExpanded = expandedId === order.id;
                            return (
                                <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">

                                    {/* Row */}
                                    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}>

                                        {/* Order # */}
                                        <div className="flex-shrink-0 w-16">
                                            <p className="text-xs text-gray-400">Order</p>
                                            <p className="font-bold text-gray-900">#{order.id}</p>
                                        </div>

                                        {/* Customer */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{order.email || '—'}</p>
                                            <p className="text-xs text-gray-400 truncate">{order.shippingAddress || '—'}</p>
                                        </div>

                                        {/* Items count */}
                                        <div className="flex-shrink-0 text-center hidden sm:block">
                                            <p className="text-xs text-gray-400">Items</p>
                                            <p className="text-sm font-semibold text-gray-700">{items.length}</p>
                                        </div>

                                        {/* Total */}
                                        <div className="flex-shrink-0 text-right hidden sm:block">
                                            <p className="text-xs text-gray-400">Total</p>
                                            <p className="text-sm font-bold text-gray-900">${Number(order.total || 0).toFixed(2)}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex-shrink-0 text-right hidden md:block">
                                            <p className="text-xs text-gray-400">Date</p>
                                            <p className="text-xs text-gray-600">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                                            <select value={order.status || 'pending'}
                                                disabled={updatingId === order.id}
                                                onChange={e => updateStatus(order.id, e.target.value)}
                                                className={`text-xs font-semibold border rounded-full px-2.5 py-1 capitalize focus:outline-none cursor-pointer transition
                                                    ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}
                                                    ${updatingId === order.id ? 'opacity-50' : ''}`}>
                                                {STATUSES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Expand */}
                                        <div className="flex-shrink-0 text-gray-300">
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-4">

                                            {/* Items */}
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Items</p>
                                                <div className="space-y-2">
                                                    {items.map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                                                                <span className="font-medium text-gray-800">{item.name}</span>
                                                                {item.size && <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{item.size}</span>}
                                                                {item.color && <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{item.color}</span>}
                                                            </div>
                                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                                <span className="text-gray-500 text-xs">×{item.quantity}</span>
                                                                <span className="font-semibold text-gray-900">${Number(item.price * item.quantity).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Footer: address + total */}
                                            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t border-gray-200">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Ship To</p>
                                                    <p className="text-sm text-gray-600">{order.shippingAddress || '—'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Order Total</p>
                                                    <p className="text-xl font-bold text-gray-900">${Number(order.total || 0).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Orders;