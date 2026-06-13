import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const { cartItems, cartOpen, setCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setCartOpen(false);
        navigate('/checkout');
    };

    if (!cartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 z-50"
                onClick={() => setCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold uppercase tracking-widest">Cart</h2>
                    <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="mt-4 text-sm underline text-gray-400 hover:text-black transition">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.key} className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || 'https://placehold.co/100x120?text=?'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.src = 'https://placehold.co/100x120?text=?'; }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide leading-tight">{item.name}</h3>
                                        <p className="text-sm font-bold mt-1">${item.price.toFixed(2)}</p>
                                        {(item.color || item.size) && (
                                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                                                {[item.color, item.size].filter(Boolean).join(' / ')}
                                            </p>
                                        )}

                                        {/* Quantity + Remove */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.key, -1)}
                                                    className="px-2 py-1 hover:bg-gray-100 transition">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.key, 1)}
                                                    className="px-2 py-1 hover:bg-gray-100 transition">
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.key)}
                                                className="text-xs text-gray-400 hover:text-black underline transition">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Taxes and shipping calculated at checkout</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-base">Total</span>
                            <span className="font-bold text-base">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition rounded">
                            Checkout | ${totalPrice.toFixed(2)}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;