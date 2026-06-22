import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';

const API_URL = 'http://localhost:8080/api';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState(null);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/contact`);
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleOpen = async (msg) => {
        const opening = openId !== msg.id;
        setOpenId(opening ? msg.id : null);
        if (opening && !msg.read) {
            try {
                await fetch(`${API_URL}/contact/${msg.id}/read`, { method: 'PUT' });
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
            } catch { /* non-critical */ }
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this message?')) return;
        try {
            await fetch(`${API_URL}/contact/${id}`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch {
            alert('Failed to delete message');
        }
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <AdminLayout>
            <div className="p-6 sm:p-8 max-w-3xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-gray-900">Messages</h1>
                    {unreadCount > 0 && (
                        <span className="text-xs font-medium px-2.5 py-1 bg-black text-white rounded-full">
                            {unreadCount} unread
                        </span>
                    )}
                </div>

                {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                ) : messages.length === 0 ? (
                    <p className="text-sm text-gray-400">No messages yet — submissions from the Contact Us page will show up here.</p>
                ) : (
                    <div className="space-y-2">
                        {messages.map(msg => (
                            <div key={msg.id} onClick={() => toggleOpen(msg)}
                                className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-gray-300 transition">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        {msg.read ? <MailOpen size={16} className="text-gray-300 mt-0.5 flex-shrink-0" /> : <Mail size={16} className="text-black mt-0.5 flex-shrink-0" />}
                                        <div className="min-w-0">
                                            <p className={`text-sm truncate ${msg.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                                                {msg.subject || '(no subject)'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {msg.name} · {msg.email} · {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDelete(msg.id, e)}
                                        className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                                {openId === msg.id && (
                                    <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100 leading-relaxed whitespace-pre-line">
                                        {msg.message}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default Messages;