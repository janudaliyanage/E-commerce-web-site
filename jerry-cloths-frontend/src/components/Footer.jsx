import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

// label -> route. Internal routes use react-router Link; this keeps the
// render loop below clean and is the single place to repoint a link later.
const HELP_LINKS = {
  'FAQs': '/info/faqs',
  'Returns and Exchanges': '/info/returns',
  'Contact Us': '/contact',
  'Terms of Service': '/info/terms',
  'General Size Chart': '/info/size-chart',
  'Shipping and Delivery Policy': '/info/shipping',
  'Privacy Policy': '/info/privacy',
};

const SHOP_LINKS = {
  'Search': '/search',
  'All Products': '/products',
  'Gift Card': '/info/gift-card',
  'Rewards': '/info/rewards',
  'Shipping Protection': '/info/shipping-protection',
};

const EXPLORE_LINKS = {
  'Our Story': '/info/our-story',
  'Customer Reviews': '/reviews',
  'Careers': '/info/careers',
  'Account': '/login',
  'Store Location': '/info/store-location',
};

const FooterColumn = ({ title, links }) => (
  <div>
    <h4 className="text-xs font-bold tracking-widest uppercase mb-4">{title}</h4>
    <ul className="space-y-3">
      {Object.entries(links).map(([label, to]) => (
        <li key={label}>
          <Link to={to} className="text-sm text-gray-500 hover:text-black transition">{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to subscribe');
      setStatus('done');
      setMessage(data.message || 'Subscribed!');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong — try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          <FooterColumn title="Help" links={HELP_LINKS} />
          <FooterColumn title="Shop With Us" links={SHOP_LINKS} />
          <FooterColumn title="Explore" links={EXPLORE_LINKS} />

          {/* NEWSLETTER — really a "notify me about new drops" signup */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Join The Jerry Cloths Family</h4>
            <p className="text-sm text-gray-500 mb-4">
              Be the first to know when new products drop. No spam, just new arrivals.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === 'sending'}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
              <button type="submit" disabled={status === 'sending'}
                className="w-full py-2 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition disabled:opacity-50">
                {status === 'sending' ? 'Subscribing...' : status === 'done' ? message : 'Subscribe'}
              </button>
              {status === 'error' && <p className="text-xs text-red-500">{message}</p>}
            </form>
          </div>

          {/* ABOUT */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">About The Shop</h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              Jerry Cloths is a lifestyle clothing brand. From start to finish, each product is designed with our customers and quality in mind. We make unique and special products that our customers can wear with pride.
            </p>
            <p className="text-sm text-gray-500">Any Questions? (818) 206-8764</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Social Icons — placeholder handles, update to your real ones */}
          <div className="flex items-center gap-4">
            <a href="https://instagram.com/jerrycloths" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition">
              <Instagram size={20} />
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com/@jerrycloths" target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400 tracking-widest uppercase">© 2026 — Jerry Cloths</p>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            {[
              { label: 'AMEX', bg: 'bg-blue-700' },
              { label: 'Apple', bg: 'bg-black' },
              { label: 'Diners', bg: 'bg-gray-600' },
              { label: 'Disc', bg: 'bg-orange-500' },
              { label: 'GPay', bg: 'bg-white border border-gray-200' },
              { label: 'MC', bg: 'bg-red-600' },
              { label: 'PayPal', bg: 'bg-blue-500' },
              { label: 'Shop', bg: 'bg-purple-600' },
              { label: 'VISA', bg: 'bg-blue-800' },
            ].map(p => (
              <div key={p.label} className={`${p.bg} rounded px-1.5 py-0.5 text-[9px] font-bold text-white`}>
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;