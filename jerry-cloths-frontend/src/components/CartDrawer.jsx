import React, { useContext } from 'react';
import { CartContext } from '../Context/Context.js';
import { X, Trash2, Plus, Minus } from 'lucide-react';

const CartDrawer = () => {
    const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);

    if (!cartOpen) return null;

    const subtotal = getTotalPrice();
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setCartOpen(false)}
            />

            {/* Right Sidebar */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.imgUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80?text=Product';
                                        }}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="p-1 hover:bg-gray-100 rounded transition"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="p-1 hover:bg-gray-100 rounded transition"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Summary & Checkout */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                        {/* Price Breakdown */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax (10%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition">
                            Proceed to Checkout
                        </button>

                        {/* Continue Shopping */}
                        <button
                            onClick={() => setCartOpen(false)}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 rounded-lg transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;