import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import infoContent from '../data/infoContent';

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-4">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4">
                <span className="font-semibold text-gray-900">{q}</span>
                <ChevronDown size={18} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{a}</p>}
        </div>
    );
};

const InfoPage = () => {
    const { slug } = useParams();
    const content = infoContent[slug];

    if (!content) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-3">We couldn't find that page.</p>
                    <Link to="/" className="text-sm font-medium underline text-gray-600 hover:text-black">Back to home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900 mb-8">{content.title}</h1>

                {content.type === 'faq' && (
                    <div className="bg-white rounded-xl border border-gray-100 px-6">
                        {content.items.map((item, i) => <FaqItem key={i} {...item} />)}
                    </div>
                )}

                {content.type === 'paragraphs' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 space-y-6">
                        {content.sections.map((s, i) => (
                            <div key={i}>
                                {s.heading && <h2 className="font-semibold text-gray-900 mb-1.5">{s.heading}</h2>}
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {content.type === 'table' && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8">
                        {content.intro && <p className="text-sm text-gray-600 mb-5">{content.intro}</p>}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        {content.columns.map(col => (
                                            <th key={col} className="text-left py-2 pr-4 font-bold uppercase tracking-wide text-xs text-gray-500">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.rows.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-100 last:border-0">
                                            {row.map((cell, j) => (
                                                <td key={j} className="py-2.5 pr-4 text-gray-700">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfoPage;