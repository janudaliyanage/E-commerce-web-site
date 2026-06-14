import React, { useState } from 'react';
import { Search, ShoppingBag, User, Menu, ChevronDown, ChevronRight, X, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CATEGORIES = {
  'FOR HIM': {
    desktopColumns: [
      { title: 'PRODUCTS', links: ['Tanks', 'Shirts', 'Longsleeves', 'Shorts', 'Pants/Jeans', 'Outerwear', 'Joggers', 'Hats/Beanies'] },
      { title: 'FEATURED', links: ['Preview New Drop', 'New Drop', 'Restock', 'Best Sellers', 'SALE'] }
    ],
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    imageCaption: "MEN'S NEW DROP",
  },
  'FOR HER': {
    desktopColumns: [
      { title: 'PRODUCTS', links: ['Bras', 'Tops', 'Bodysuits', 'Leggings', 'Shorts', 'Joggers', 'Outerwear'] },
      { title: 'FEATURED', links: ['New Drop', 'Restock', 'Best Sellers'] }
    ],
    image: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&q=80&w=800',
    imageCaption: "WOMEN'S NEW DROP",
  },
  'NEW DROP': {
    desktopColumns: [
      { title: 'NEW DROP', links: ['New Drop For Him', 'New Drop For Her'] },
      { title: 'RESTOCK', links: ['Restock For Him', 'Restock For Her'] }
    ],
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    imageCaption: "LATEST COLLECTION",
  },
  'COLLABS': {
    desktopColumns: [
      { title: 'COLLABS', links: ['Attack on Titan', 'UFC', 'Golds Gym', 'Yu-Gi-Oh!', 'The Boys'] }
    ],
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800',
    imageCaption: "OFFICIAL COLLABS",
  },
  'LOOKBOOK': {
    desktopColumns: [
      { title: 'LOOKBOOK', links: ['For Him', 'For Her'] }
    ],
    image: null,
  }
};

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const { setCartOpen, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCartClick = () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setCartOpen(true);
  };

  const getCategoryLink = (category, subcategory) => {
    if (subcategory) return `/category/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`;
    return `/category/${encodeURIComponent(category)}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm" onMouseLeave={() => setActiveMenu(null)}>
        {/* Top bar */}
        <div className="border-b border-gray-100 bg-white relative z-50">
          <div className="max-w-[1800px] mx-auto flex justify-between items-center px-4 md:px-6 py-3">
            <div className="md:hidden flex items-center">
              <Menu className="w-6 h-6 cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
            </div>
            <div className="hidden md:flex text-[10px] font-bold text-gray-500 tracking-widest">
              QUESTIONS? (818) 206-8764
            </div>
            <div className="flex-1 flex justify-center absolute left-0 right-0 md:static pointer-events-none md:pointer-events-auto">
              <Link to="/" className="pointer-events-auto">
                <img src="/assets/logo.png" alt="Jerry Cloths" className="h-8 md:h-10 object-contain"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                <span style={{ display: 'none' }} className="font-bold text-lg tracking-widest">JERRY CLOTHS</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4 md:space-x-6 z-10">
              <Link to="/login"><User className="w-5 h-5 cursor-pointer text-gray-800 hover:text-gray-500 transition hidden md:block" /></Link>
              <Search className="w-5 h-5 cursor-pointer text-gray-800 hover:text-gray-500 transition" />
              <button onClick={handleCartClick} className="relative">
                <ShoppingBag className="w-5 h-5 cursor-pointer text-gray-800 hover:text-gray-500 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
              <div className="hidden md:flex items-center text-xs font-bold ml-2 cursor-pointer hover:opacity-70">
                🇺🇸 US <ChevronDown size={12} className="ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block relative bg-white z-40 border-b border-gray-100">
          <div className="flex justify-center">
            {Object.keys(CATEGORIES).map(item => (
              <div key={item} className="px-6 py-4 cursor-pointer" onMouseEnter={() => setActiveMenu(item)}>
                <Link to={getCategoryLink(item)}
                  className={`flex items-center gap-1 text-[11px] font-extrabold tracking-[0.15em] hover:text-yellow-600 transition uppercase
                    ${activeMenu === item ? 'text-yellow-600' : ''}`}>
                  {item} <ChevronDown size={10} />
                </Link>
              </div>
            ))}
          </div>

          {/* Dropdown */}
          {activeMenu && CATEGORIES[activeMenu] && (
            <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50"
              onMouseEnter={() => setActiveMenu(activeMenu)}
              onMouseLeave={() => setActiveMenu(null)}>
              <div className="max-w-7xl mx-auto px-10 py-12 flex justify-between min-h-[300px]">
                <div className="flex gap-20">
                  {CATEGORIES[activeMenu].desktopColumns?.map((col, idx) => (
                    <div key={idx} className="min-w-[160px]">
                      <h4 className="text-xs font-bold tracking-[0.1em] text-gray-400 mb-6 uppercase">{col.title}</h4>
                      <ul className="space-y-3">
                        {col.links.map(link => (
                          <li key={link}>
                            <Link
                              to={getCategoryLink(activeMenu, link)}
                              onClick={() => setActiveMenu(null)}
                              className="text-sm text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition font-medium">
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {CATEGORIES[activeMenu].image && (
                  <div className="w-[280px] flex flex-col items-center text-center">
                    <div className="w-full h-[300px] overflow-hidden bg-gray-100 mb-4">
                      <img src={CATEGORIES[activeMenu].image} alt="Featured"
                        className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                    </div>
                    <Link to={getCategoryLink(activeMenu)}
                      className="text-xs font-bold tracking-[0.2em] uppercase border-b border-transparent hover:border-black pb-1">
                      {CATEGORIES[activeMenu].imageCaption}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#121212] text-white z-[60] overflow-hidden md:hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-800">
              <span className="font-bold tracking-widest">MENU</span>
              <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {!mobileSubMenu ? (
                Object.keys(CATEGORIES).map(key => (
                  <button key={key} onClick={() => setMobileSubMenu(key)}
                    className="flex justify-between items-center w-full px-6 py-5 border-b border-gray-800 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition">
                    {key}<ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <>
                  <button onClick={() => setMobileSubMenu(null)}
                    className="flex items-center w-full px-6 py-5 border-b border-gray-800 text-yellow-400 font-bold text-sm uppercase bg-gray-900">
                    <ChevronLeft size={16} className="mr-2" />{mobileSubMenu}
                  </button>
                  <Link to={getCategoryLink(mobileSubMenu)}
                    onClick={() => { setMobileMenuOpen(false); setMobileSubMenu(null); }}
                    className="block px-6 py-4 border-b border-gray-800 text-sm font-bold text-white">
                    All {mobileSubMenu}
                  </Link>
                  {CATEGORIES[mobileSubMenu].desktopColumns?.flatMap(col => col.links).map(link => (
                    <Link key={link}
                      to={getCategoryLink(mobileSubMenu, link)}
                      onClick={() => { setMobileMenuOpen(false); setMobileSubMenu(null); }}
                      className="block px-6 py-4 border-b border-gray-800 text-sm text-gray-300 hover:text-white">
                      {link}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;