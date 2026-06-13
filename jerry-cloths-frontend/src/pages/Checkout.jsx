import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { CreditCard, Lock } from 'lucide-react';

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [placing, setPlacing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [form, setForm] = useState({
        email: localStorage.getItem('userEmail') || '',
        firstName: '', lastName: '', address: '',
        apartment: '', city: '', postalCode: '', country: 'Sri Lanka',
        cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
        billingAddressSame: true,
    });

    const shipping = 5.99;
    const total = totalPrice + shipping;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const formatCardNumber = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    };

    const formatExpiry = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        setPlacing(true);
        try {
            const orderData = {
                userId: parseInt(localStorage.getItem('userId')),
                items: cartItems.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                })),
                shippingAddress: `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.postalCode}, ${form.country}`,
                email: form.email,
                total: total,
                status: 'pending',
            };

            const res = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (res.ok) {
                clearCart();
                navigate('/order-success');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            alert('Error placing order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-black text-white rounded">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left - Form */}
                <div>
                    <h1 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest">Jerry Cloths</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Contact */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold text-lg">Contact</h2>
                                <button type="button" onClick={() => navigate('/login')} className="text-sm text-gray-500 underline">Sign in</button>
                            </div>
                            <input type="email" name="email" value={form.email} onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm"
                                required />
                        </div>

                        {/* Delivery */}
                        <div>
                            <h2 className="font-semibold text-lg mb-3">Delivery</h2>
                            <div className="space-y-3">
                                <select name="country" value={form.country} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm">
                                    <option>Sri Lanka</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Australia</option>
                                    <option>Canada</option>
                                    <option>India</option>
                                </select>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                                        placeholder="First name" required
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                                        placeholder="Last name" required
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                </div>
                                <input type="text" name="address" value={form.address} onChange={handleChange}
                                    placeholder="Address" required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                <input type="text" name="apartment" value={form.apartment} onChange={handleChange}
                                    placeholder="Apartment, suite, etc. (optional)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" name="postalCode" value={form.postalCode} onChange={handleChange}
                                        placeholder="Postal code (optional)"
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                    <input type="text" name="city" value={form.city} onChange={handleChange}
                                        placeholder="City" required
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div>
                            <h2 className="font-semibold text-lg mb-1">Payment</h2>
                            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1"><Lock size={12} /> All transactions are secure and encrypted.</p>

                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Card Option */}
                                <label className={`flex items-center justify-between px-4 py-3 cursor-pointer ${paymentMethod === 'card' ? 'bg-blue-50 border-b border-blue-200' : 'border-b border-gray-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')} />
                                        <span className="text-sm font-medium">Credit card</span>
                                    </div>
                                    <div className="flex gap-1 text-xs">
                                        {['VISA', 'MC', 'AMEX'].map(c => (
                                            <span key={c} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold">{c}</span>
                                        ))}
                                    </div>
                                </label>

                                {paymentMethod === 'card' && (
                                    <div className="p-4 space-y-3 bg-gray-50">
                                        <input type="text" name="cardNumber" value={form.cardNumber}
                                            onChange={e => setForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                            placeholder="Card number" maxLength={19}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm bg-white" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" name="expiry" value={form.expiry}
                                                onChange={e => setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                                                placeholder="Expiration date (MM / YY)" maxLength={5}
                                                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm bg-white" />
                                            <input type="text" name="cvv" value={form.cvv}
                                                onChange={e => setForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                                placeholder="Security code"
                                                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm bg-white" />
                                        </div>
                                        <input type="text" name="nameOnCard" value={form.nameOnCard} onChange={handleChange}
                                            placeholder="Name on card"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm bg-white" />
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" name="billingAddressSame" checked={form.billingAddressSame} onChange={handleChange} />
                                            Use shipping address as billing address
                                        </label>
                                    </div>
                                )}

                                {/* PayPal Option */}
                                <label className={`flex items-center justify-between px-4 py-3 cursor-pointer ${paymentMethod === 'paypal' ? 'bg-blue-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="payment" value="paypal" checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')} />
                                        <span className="text-sm font-medium">PayPal</span>
                                    </div>
                                    <span className="text-blue-600 font-bold text-sm italic">PayPal</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" disabled={placing}
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition rounded-lg disabled:opacity-50">
                            {placing ? 'Placing Order...' : 'Pay now'}
                        </button>
                    </form>
                </div>

                {/* Right - Order Summary */}
                <div className="lg:border-l lg:border-gray-200 lg:pl-12">
                    <div className="sticky top-8">
                        <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-4 mb-6">
                            {cartItems.map(item => (
                                <div key={item.key} className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={item.image || 'https://placehold.co/64x64?text=?'} alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.target.src = 'https://placehold.co/64x64?text=?'; }} />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{item.name}</p>
                                        {(item.color || item.size) && (
                                            <p className="text-xs text-gray-400">{[item.color, item.size].filter(Boolean).join(' / ')}</p>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <hr className="border-gray-200 mb-4" />

                        {/* Totals */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal · {cartItems.reduce((s, i) => s + i.quantity, 0)} items</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;