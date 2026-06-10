import React, { useState } from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* HELP */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Help</h4>
            <ul className="space-y-3">
              {['FAQs', 'Returns and Exchanges', 'Contact Us', 'Terms of Service', 'General Size Chart', 'Shipping and Delivery Policy', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-black transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOP WITH US */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Shop With Us</h4>
            <ul className="space-y-3">
              {['Search', 'All Products', 'Gift Card', 'Rewards', 'Shipping Protection'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-black transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Explore</h4>
            <ul className="space-y-3">
              {['Our Story', 'Customer Reviews', 'Careers', 'Account', 'Store Location'].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-black transition">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Join The Jerry Cloths Family</h4>
            <p className="text-sm text-gray-500 mb-4">
              Instantly receive updates, access to exclusive deals, product launch details, and more.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
              />
              <button type="submit"
                className="w-full py-2 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
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

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-black transition">
              <Instagram size={20} />
            </a>
            {/* TikTok */}
            <a href="#" className="text-gray-500 hover:text-black transition">
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