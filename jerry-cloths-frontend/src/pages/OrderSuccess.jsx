import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md w-full text-center">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
                <p className="text-gray-500 mb-8">Thank you for your order. We'll send you a confirmation email shortly.</p>
                <button onClick={() => navigate('/')}
                    className="w-full py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition rounded-lg">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderSuccess;