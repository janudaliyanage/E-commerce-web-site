import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API_URL = 'http://localhost:8080/api';
const COLORS = ['#000000', '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
const RANGES = [
    { label: '7 days', days: 7 },
    { label: '30 days', days: 30 },
    { label: '90 days', days: 90 },
    { label: 'All time', days: 99999 },
];
const fmt = (n) => `$${Number(n || 0).toFixed(2)}`;

// Measures its container and passes explicit pixel width to the chart.
// Bypasses ResponsiveContainer entirely — fixes React 19 + Recharts v3 crash.
const AutoChart = ({ height = 220, children }) => {
    const ref = useRef(null);
    const [w, setW] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        setW(ref.current.offsetWidth);
        const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ width: '100%', height }}>
            {w > 0 && React.cloneElement(children, { width: w, height })}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className={`${color} p-2 rounded-lg`}><Icon size={15} className="text-white" /></div>
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-700 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name === 'revenue' ? fmt(p.value) : p.value}
                </p>
            ))}
        </div>
    );
};

const EmptyChart = ({ text = 'No data for this period.', height = 220 }) => (
    <div style={{ height }} className="flex items-center justify-center text-gray-400 text-sm">{text}</div>
);

const Sales = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(30);
    const [selectedProduct, setSelectedProduct] = useState('all');

    useEffect(() => {
        fetch(`${API_URL}/orders`)
            .then(r => r.json())
            .then(d => setOrders(Array.isArray(d) ? d : []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    const parseItems = (json) => { try { return JSON.parse(json || '[]'); } catch { return []; } };
    const cutoff = new Date(Date.now() - range * 24 * 60 * 60 * 1000);
    const filtered = orders.filter(o => range >= 99999 || new Date(o.createdAt) >= cutoff);

    // Revenue by day
    const revenueByDay = (() => {
        const map = {};
        filtered.forEach(o => {
            if (!o.createdAt) return;
            const day = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[day] = (map[day] || 0) + (o.total || 0);
        });
        return Object.entries(map)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
    })();

    // Product sales
    const productMap = {};
    filtered.forEach(o => parseItems(o.items).forEach(item => {
        if (!productMap[item.name]) productMap[item.name] = { name: item.name, revenue: 0, units: 0 };
        productMap[item.name].revenue += (item.price || 0) * (item.quantity || 1);
        productMap[item.name].units += (item.quantity || 1);
    }));
    const productSales = Object.values(productMap)
        .sort((a, b) => b.revenue - a.revenue)
        .map(p => ({ ...p, revenue: +p.revenue.toFixed(2) }));
    const productNames = ['all', ...productSales.map(p => p.name)];

    // Order status
    const statusMap = {};
    filtered.forEach(o => { const s = o.status || 'pending'; statusMap[s] = (statusMap[s] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // Per-product timeline
    const productTimeline = (() => {
        if (selectedProduct === 'all') return revenueByDay;
        const map = {};
        filtered.forEach(o => {
            if (!o.createdAt) return;
            const day = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            parseItems(o.items).forEach(item => {
                if (item.name === selectedProduct)
                    map[day] = (map[day] || 0) + (item.price || 0) * (item.quantity || 1);
            });
        });
        return Object.entries(map)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([date, revenue]) => ({ date, revenue: +revenue.toFixed(2) }));
    })();

    const totalRevenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
    const totalOrders = filtered.length;
    const avgOrder = totalOrders ? totalRevenue / totalOrders : 0;
    const totalUnits = filtered.reduce((s, o) => s + parseItems(o.items).reduce((a, i) => a + (i.quantity || 1), 0), 0);

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8 space-y-6">

                {/* Header + Range */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Sales Analytics</h1>
                        <p className="text-sm text-gray-400">Revenue, orders and product performance</p>
                    </div>
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                        {RANGES.map(r => (
                            <button key={r.days} onClick={() => setRange(r.days)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                                    ${range === r.days ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={DollarSign} label="Total Revenue" value={loading ? '…' : fmt(totalRevenue)} sub={`${totalOrders} orders`} color="bg-green-500" />
                    <StatCard icon={ShoppingCart} label="Orders" value={loading ? '…' : totalOrders} sub={`Avg ${fmt(avgOrder)}/order`} color="bg-purple-500" />
                    <StatCard icon={Package} label="Units Sold" value={loading ? '…' : totalUnits} sub={`${productSales.length} products`} color="bg-blue-500" />
                    <StatCard icon={TrendingUp} label="Top Product" value={loading ? '…' : (productSales[0]?.name || '—')} sub={productSales[0] ? fmt(productSales[0].revenue) : 'No sales yet'} color="bg-orange-500" />
                </div>

                {/* Revenue Over Time */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-gray-900">Revenue Over Time</h2>
                        {productSales.length > 0 && (
                            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-black bg-white">
                                {productNames.map(n => (
                                    <option key={n} value={n}>{n === 'all' ? 'All products' : n}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    {loading
                        ? <div className="animate-pulse h-56 bg-gray-50 rounded-xl" />
                        : productTimeline.length === 0
                            ? <EmptyChart text="No sales data for this period." />
                            : (
                                <AutoChart height={220}>
                                    <LineChart data={productTimeline}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2.5} dot={{ fill: '#000', r: 3 }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </AutoChart>
                            )
                    }
                </div>

                {/* Bar + Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900 mb-5">Revenue by Product</h2>
                        {loading
                            ? <div className="animate-pulse h-56 bg-gray-50 rounded-xl" />
                            : productSales.length === 0
                                ? <EmptyChart text="No product sales yet." />
                                : (
                                    <AutoChart height={Math.max(220, productSales.length * 52)}>
                                        <BarChart data={productSales} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                                            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#374151' }} tickLine={false} axisLine={false} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                                                {productSales.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Bar>
                                        </BarChart>
                                    </AutoChart>
                                )
                        }
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h2 className="font-semibold text-gray-900 mb-5">Order Status</h2>
                        {loading
                            ? <div className="animate-pulse h-56 bg-gray-50 rounded-xl" />
                            : statusData.length === 0
                                ? <EmptyChart text="No orders yet." height={160} />
                                : (
                                    <>
                                        <AutoChart height={160}>
                                            <PieChart>
                                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                                                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip formatter={(v, n) => [v, n]} />
                                            </PieChart>
                                        </AutoChart>
                                        <div className="space-y-2 mt-3">
                                            {statusData.map((s, i) => (
                                                <div key={s.name} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                        <span className="capitalize text-gray-700">{s.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{s.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )
                        }
                    </div>
                </div>

                {/* Product Breakdown Table */}
                {productSales.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Product Breakdown</h2>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                                <tr>
                                    <th className="px-5 py-3 text-left">#</th>
                                    <th className="px-5 py-3 text-left">Product</th>
                                    <th className="px-5 py-3 text-right">Units</th>
                                    <th className="px-5 py-3 text-right">Revenue</th>
                                    <th className="px-5 py-3 text-right">Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {productSales.map((p, i) => (
                                    <tr key={p.name} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                                        <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                                        <td className="px-5 py-3 text-right text-gray-600">{p.units}</td>
                                        <td className="px-5 py-3 text-right font-bold text-gray-900">{fmt(p.revenue)}</td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-1.5 rounded-full bg-black"
                                                        style={{ width: `${totalRevenue ? Math.round((p.revenue / totalRevenue) * 100) : 0}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-400 w-8 text-right">
                                                    {totalRevenue ? Math.round((p.revenue / totalRevenue) * 100) : 0}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Sales;