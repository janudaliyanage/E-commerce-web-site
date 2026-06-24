import React, { useState } from 'react';
import { Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error

    const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;
        setStatus('sending');
        try {
            const res = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Failed');
            setStatus('sent');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Help</p>
                    <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Contact Us</h1>
                    <p className="text-sm text-gray-500 mt-2">Questions about an order, sizing, or anything else — we'll get back to you.</p>
                </div>

                <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Phone size={16} /> (818) 206-8764</span>
                    <span className="flex items-center gap-2"><Mail size={16} /> hello@jerrycloths.com</span>
                </div>

                {status === 'sent' ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                        <CheckCircle2 className="mx-auto mb-3 text-green-600" size={36} />
                        <p className="font-semibold text-gray-900">Message sent</p>
                        <p className="text-sm text-gray-500 mt-1">We typically reply within 1–2 business days.</p>
                        <button onClick={() => setStatus('idle')}
                            className="mt-4 text-sm font-medium underline text-gray-600 hover:text-black">
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                                <input required value={form.name} onChange={handleChange('name')}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                <input required type="email" value={form.email} onChange={handleChange('email')}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                            <input value={form.subject} onChange={handleChange('subject')}
                                placeholder="e.g. Order #1042"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                            <textarea required rows={5} value={form.message} onChange={handleChange('message')}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black resize-none" />
                        </div>
                        {status === 'error' && (
                            <p className="text-sm text-red-500">Something went wrong — please try again.</p>
                        )}
                        <button type="submit" disabled={status === 'sending'}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition disabled:opacity-50">
                            {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : null}
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactUs;