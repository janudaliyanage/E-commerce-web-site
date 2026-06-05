import React from 'react';
import AdminLayout from './AdminLayout';

const ComingSoon = ({ title }) => (
    <AdminLayout>
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚧</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-500 text-sm">This section is under construction. Check back later!</p>
            </div>
        </div>
    </AdminLayout>
);

export default ComingSoon;