import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!token && !!userId);
        if (token && userId) {
            const saved = localStorage.getItem(`cart_${userId}`);
            if (saved) setCartItems(JSON.parse(saved));
        }
    }, []);

    const saveCart = (items) => {
        const userId = localStorage.getItem('userId');
        if (userId) localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
    };

    const addToCart = (product, selectedColor, selectedSize) => {
        const token = localStorage.getItem('token');
        if (!token) return false; // not logged in

        const key = `${product.id}_${selectedColor?.label || ''}_${selectedSize || ''}`;
        setCartItems(prev => {
            const existing = prev.find(item => item.key === key);
            let newItems;
            if (existing) {
                newItems = prev.map(item => item.key === key ? { ...item, quantity: item.quantity + 1 } : item);
            } else {
                const images = (() => { try { return JSON.parse(product.images || '[]'); } catch { return product.imgUrl ? [product.imgUrl] : []; } })();
                newItems = [...prev, {
                    key,
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: selectedColor?.imageUrl || images[0] || '',
                    color: selectedColor?.label || null,
                    size: selectedSize || null,
                    quantity: 1,
                }];
            }
            saveCart(newItems);
            return newItems;
        });
        setCartOpen(true);
        return true;
    };

    const removeFromCart = (key) => {
        setCartItems(prev => {
            const newItems = prev.filter(item => item.key !== key);
            saveCart(newItems);
            return newItems;
        });
    };

    const updateQuantity = (key, delta) => {
        setCartItems(prev => {
            const newItems = prev.map(item => {
                if (item.key !== key) return item;
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return { ...item, quantity: newQty };
            }).filter(Boolean);
            saveCart(newItems);
            return newItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        const userId = localStorage.getItem('userId');
        if (userId) localStorage.removeItem(`cart_${userId}`);
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartOpen, setCartOpen, isLoggedIn, setIsLoggedIn,
            addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalPrice,
        }}>
            {children}
        </CartContext.Provider>
    );
};