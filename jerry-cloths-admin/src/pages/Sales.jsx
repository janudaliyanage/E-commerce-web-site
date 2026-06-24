import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { fetchAllProducts } from '../services/api';

const API_URL = 'http://localhost:8080/api';

const PERIOD_OPTIONS = [
    { label: '7 days', days: 7 },
    { label: '30 days', days: 30 },
    { label: '90 days', days: 90 },
    { label: 'All time', days: 99999 },
];

const BAR_COLORS = ['#111', '#555', '#888', '#aaa', '#ccc'];

// Custom tooltip for line chart
const RevenueTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
            <p className="text-gray-500 mb-0.5">{label}</p>
            <p className="font-bold text-gray-900">${Number(payload[0].value).toFixed(2)}</p>
            <p className="text-xs text-gray-400">{payload[1]?.value} orders</p>
        </div>
    );
};

const ProductTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
            <p className="font-semibold text-gray-900 mb-0.5">{payload[0]?.payload?.name}</p>
            <p className="text-gray-700">Revenue: <span className="font-bold">${Number(payload[0].value).toFixed(2)}</span></p>
            <p className="text-gray-400 text-xs">{payload[0]?.payload?.qty} units sold</p>
        </div>
    );
};

const Sales = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(30);
    const [selectedProduct, setSelectedProduct] = useState('all');

    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/orders`).then(r => r.json()).catch(() => []),
            fetchAllProducts().catch(() => []),
        ]).then(([o, p]) => {
            setOrders(Array.isArray(o) ? o : []);
            setProducts(Array.isArray(p) ? p : []);
        }).finally(() => setLoading(false));
    }, []);

    // Filter orders by selected period
    const cutoff = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
    const filteredOrders = orders.filter(o =>
        period === 99999 || new Date(o.createdAt) >= cutoff
    );

    // Parse items from every order
    const parseItems = (json) => { try { return JSON.parse(json || '[]'); } catch { return []; } };
    const allItems = filteredOrders.flatMap(o =>
        parseItems(o.items).map(item => ({ ...item, orderId: o.id, orderDate: o.createdAt }))
    );

    // --- Revenue over time (daily buckets) ---
    const buildRevenueChart = () => {
        const buckets = {};
        filteredOrders.forEach(o => {
            if (!o.createdAt) return;
            const d = new Date(o.createdAt);
            const key = period <= 30
                ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (!buckets[key]) buckets[key] = { date: key, revenue: 0, orders: 0 };
            buckets[key].revenue += o.total || 0;
            buckets[key].orders += 1;
        });
        return Object.values(buckets).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    };

    // --- Revenue by product ---
    const buildProductChart = () => {
        const map = {};
        allItems.forEach(item => {
            const name = item.name || 'Unknown';
            if (!map[name]) map[name] = { name, revenue: 0, qty: 0 };
            map[name].revenue += (item.price || 0) * (item.quantity || 1);
            map[name].qty += item.quantity || 1;
        });
        return Object.values(map)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8);
    };

    // --- Per-product orders history (when one product is selected) ---
    const buildProductHistory = () => {
        const relevant = allItems.filter(i => i.name === selectedProduct);
        const buckets = {};
        relevant.forEach(item => {
            const d = item.orderDate ? new Date(item.orderDate) : new Date();
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!buckets[key]) buckets[key] = { date: key, revenue: 0, units: 0 };
            buckets[key].revenue += (item.price || 0) * (item.quantity || 1);
            buckets[key].units += item.quantity || 1;
        });
        return Object.values(buckets).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const revenueData = buildRevenueChart();
    const productData = buildProductChart();
    const productHistory = selectedProduct !== 'all' ? buildProductHistory() : [];

    // Summary stats
    const totalRevenue = filteredOrders.reduce((s, o) => s + (o.total || 0), 0);
    const totalUnits = allItems.reduce((s, i) => s + (i.quantity || 1), 0);
    const avgOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
    const topProduct = productData[0];

    const statCards = [
        { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Orders', value: filteredOrders.length, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Units Sold', value: totalUnits, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg Order', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    if (loading) return (
        <AdminLayout>
            <div className="p-8 text-center text-gray-400">Loading sales data…</div>
        </AdminLayout>
    );

    const noData = filteredOrders.length === 0;

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8 space-y-6">

                {/* Header + Period selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Sales</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Revenue and product performance</p>
                    </div>
                    <div className="flex gap-1.5 bg-gray-100 rounded-xl p-1">
                        {PERIOD_OPTIONS.map(opt => (
                            <button key={opt.days} onClick={() => setPeriod(opt.days)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                                    ${period === opt.days ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map(c => {
                        const Icon = c.icon;
                        return (
                            <div key={c.label} className="bg-white rounded-xl border border-gray-100 p-4">
                                <div className={`w-8 h-8 ${c.bg} ${c.color} rounded-lg flex items-center justify-center mb-3`}>
                                    <Icon size={16} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
                            </div>
                        );
                    })}
                </div>

                {noData ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                        <TrendingUp size={36} className="mx-auto mb-3 text-gray-200" />
                        <p className="text-gray-400 font-medium">No orders in this period yet</p>
                        <p className="text-sm text-gray-300 mt-1">Sales data will appear here once customers place orders</p>
                    </div>
                ) : (
                    <>
                        {/* Revenue over time */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="font-semibold text-gray-900 mb-5">Revenue Over Time</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                                        tickFormatter={v => `$${v}`} width={52} />
                                    <Tooltip content={<RevenueTooltip />} />
                                    <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2.5}
                                        dot={false} activeDot={{ r: 5, fill: '#111' }} />
                                    <Line type="monotone" dataKey="orders" stroke="#d1d5db" strokeWidth={1.5}
                                        dot={false} strokeDasharray="4 4" />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex gap-5 mt-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-gray-900 inline-block rounded" /> Revenue</span>
                                <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-gray-300 inline-block rounded border-dashed" /> Orders</span>
                            </div>
                        </div>

                        {/* Revenue by product — bar chart */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-semibold text-gray-900">Revenue by Product</h2>
                                {topProduct && (
                                    <span className="text-xs text-gray-400">
                                        Top: <span className="font-semibold text-gray-700">{topProduct.name}</span>
                                    </span>
                                )}
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={productData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false}
                                        tickLine={false} angle={-30} textAnchor="end" interval={0} />
                                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                                        tickFormatter={v => `$${v}`} width={52} />
                                    <Tooltip content={<ProductTooltip />} />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                        {productData.map((_, i) => (
                                            <Cell key={i} fill={BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Per-product deep dive */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <h2 className="font-semibold text-gray-900">Product Deep Dive</h2>
                                <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-black bg-white">
                                    <option value="all">— Select a product —</option>
                                    {productData.map(p => (
                                        <option key={p.name} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProduct === 'all' ? (
                                /* Product table when no specific product selected */
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left pb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Product</th>
                                                <th className="text-right pb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Units</th>
                                                <th className="text-right pb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Revenue</th>
                                                <th className="text-right pb-3 text-xs font-bold uppercase tracking-wide text-gray-400">Avg Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {productData.map((p, i) => (
                                                <tr key={p.name} className="hover:bg-gray-50 cursor-pointer transition"
                                                    onClick={() => setSelectedProduct(p.name)}>
                                                    <td className="py-3 flex items-center gap-2.5">
                                                        <span className={`w-5 h-5 rounded flex-shrink-0 inline-block`}
                                                            style={{ background: BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)] }} />
                                                        <span className="font-medium text-gray-900">{p.name}</span>
                                                    </td>
                                                    <td className="py-3 text-right text-gray-600">{p.qty}</td>
                                                    <td className="py-3 text-right font-bold text-gray-900">${p.revenue.toFixed(2)}</td>
                                                    <td className="py-3 text-right text-gray-500">${(p.revenue / p.qty).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-gray-300 mt-3 text-center">Click a row to see that product's sales over time</p>
                                </div>
                            ) : (
                                /* History chart for selected product */
                                <>
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        {(() => {
                                            const pd = productData.find(p => p.name === selectedProduct);
                                            return [
                                                { label: 'Revenue', value: `$${pd?.revenue?.toFixed(2) || '0'}` },
                                                { label: 'Units Sold', value: pd?.qty || 0 },
                                                { label: 'Avg Price', value: pd ? `$${(pd.revenue / pd.qty).toFixed(2)}` : '—' },
                                            ].map(s => (
                                                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                                                    <p className="text-lg font-bold text-gray-900">{s.value}</p>
                                                    <p className="text-xs text-gray-400">{s.label}</p>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    {productHistory.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={180}>
                                            <BarChart data={productHistory} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                                                    tickFormatter={v => `$${v}`} width={52} />
                                                <Tooltip formatter={(v, n) => [n === 'revenue' ? `$${v.toFixed(2)}` : v, n === 'revenue' ? 'Revenue' : 'Units']} />
                                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#111827" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-center text-sm text-gray-400 py-8">No orders for this product in this period</p>
                                    )}
                                    <button onClick={() => setSelectedProduct('all')}
                                        className="mt-3 text-xs text-gray-400 hover:text-black transition underline">
                                        ← Back to all products
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default Sales;