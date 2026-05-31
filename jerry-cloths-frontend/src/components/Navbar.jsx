import React, { useState, useEffect, useContext } from 'react';
import { Search, ShoppingBag, User, Menu, ChevronDown, ChevronRight, X, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CartContext } from '../context/Context';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);

  // Cart Context
  const { cartOpen, setCartOpen, getTotalItems } = useContext(CartContext);
  const cartCount = getTotalItems();

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  // DATA
  const MENU_CONTENT = {
    'FOR HIM': {
      title: 'FOR HIM',
      links: [
        'Preview New Drop', 'New Drop', 'Preview Restock', 'Restock', 'Best Sellers',
        'Shorts', 'Shirts', 'Tanks', 'Joggers', 'Pants/Jeans', 'Outerwear', 'Hats/Beanies'
      ],
      desktopColumns: [
        { title: 'PRODUCTS', links: ['Tanks', 'Shirts', 'Longsleeves', 'Shorts', 'Pants/Jeans', 'Outerwear', 'Joggers', 'Hats/Beanies'] },
        { title: 'FEATURED', links: ['Preview New Drop', 'New Drop', 'Restock', 'Best Sellers', 'SALE'] }
      ],
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
      imageCaption: "MEN'S NEW DROP"
    },
    'FOR HER': {
      title: 'FOR HER',
      links: [
        'Preview New Drop', 'New Drop', 'Restock', 'Best Sellers',
        'Bras', 'Tops', 'Bodysuits', 'Leggings', 'Shorts', 'Joggers'
      ],
      desktopColumns: [
        { title: 'PRODUCTS', links: ['Bras', 'Tops', 'Bodysuits', 'Leggings', 'Shorts', 'Joggers', 'Outerwear'] },
        { title: 'FEATURED', links: ['New Drop', 'Restock', 'Best Sellers'] }
      ],
      image: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&q=80&w=800',
      imageCaption: "WOMEN'S NEW DROP"
    },
    'NEW DROP': {
      title: 'NEW DROP',
      links: ['New Drop For Him', 'New Drop For Her', 'Restock For Him', 'Restock For Her'],
      desktopColumns: [
        { title: 'NEW DROP', links: ['New Drop For Him', 'New Drop For Her'] },
        { title: 'RESTOCK', links: ['Restock For Him', 'Restock For Her'] }
      ],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
      imageCaption: "LATEST COLLECTION"
    },
    'COLLABS': {
      title: 'COLLABS',
      links: ['Attack on Titan', 'UFC', 'Golds Gym', 'Yu-Gi-Oh!', 'The Boys', 'Superman', 'Batman'],
      desktopColumns: [
        { title: 'COLLABS', links: ['Attack on Titan', 'UFC', 'Golds Gym', 'Yu-Gi-Oh!', 'The Boys'] }
      ],
      image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800',
      imageCaption: "OFFICIAL COLLABS"
    },
    'LOOKBOOK': {
      title: 'LOOKBOOK',
      links: ['For Him', 'For Her'],
      desktopColumns: [{ title: 'LOOKBOOK', links: ['For Him', 'For Her'] }],
      image: null
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm" onMouseLeave={() => setActiveMenu(null)}>
        {/* TOP UTILITY BAR */}
        <div className="border-b border-gray-100 bg-white relative z-50">
          <div className="max-w-[1800px] mx-auto flex justify-between items-center px-4 md:px-6 py-3">

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center">
              <Menu className="w-6 h-6 cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
            </div>

            {/* Desktop Question Text */}
            <div className="hidden md:flex text-[10px] font-bold text-gray-500 tracking-widest">
              QUESTIONS? (818) 206-8764
            </div>

            {/* LOGO */}
            <div className="flex-1 flex justify-center md:justify-center absolute left-0 right-0 md:static pointer-events-none md:pointer-events-auto">
              <Link to="/" className="pointer-events-auto">
                <img src="/assets/logo.png" alt="Jerry Cloths" className="h-8 md:h-10 object-contain" />
              </Link>
            </div>

            {/* ICONS - Updated with Cart */}
            <div className="flex items-center space-x-4 md:space-x-6 z-10">
              <Link to="/login">
                <User className="w-5 h-5 cursor-pointer text-gray-800 hover:text-gray-500 transition hidden md:block" />
              </Link>
              <Search className="w-5 h-5 cursor-pointer text-gray-800 hover:text-gray-500 transition" />

              {/* Shopping Cart Icon with Badge */}
              <div
                className="relative cursor-pointer"
                onClick={() => setCartOpen(!cartOpen)}
              >
                <ShoppingBag className="w-5 h-5 text-gray-800 hover:text-gray-500 transition" />
                {cartCount > 0 && (
                  <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="hidden md:flex items-center text-xs font-bold ml-2 cursor-pointer hover:opacity-70">
                🇺🇸 US <ChevronDown size={12} className="ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP NAV (Hidden on Mobile) */}
        <nav className="hidden md:block relative bg-white z-40 border-b border-gray-100">
          <div className="flex justify-center">
            {Object.keys(MENU_CONTENT).map((item) => (
              <div
                key={item}
                className="px-6 py-4 cursor-pointer"
                onMouseEnter={() => setActiveMenu(item)}
              >
                <div className="flex items-center gap-1 text-[11px] font-extrabold tracking-[0.15em] hover:text-brand-gold transition-colors uppercase">
                  {item} <ChevronDown size={10} />
                </div>
              </div>
            ))}
          </div>

          {/* MEGA MENU DROPDOWN */}
          <AnimatePresence>
            {activeMenu && MENU_CONTENT[activeMenu] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl"
                onMouseEnter={() => setActiveMenu(activeMenu)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="max-w-7xl mx-auto px-10 py-12 flex justify-between min-h-[400px]">
                  <div className="flex gap-20">
                    {MENU_CONTENT[activeMenu].desktopColumns?.map((col, idx) => (
                      <div key={idx} className="min-w-[160px]">
                        <h4 className="text-xs font-bold tracking-[0.1em] text-gray-400 mb-6 uppercase">
                          {col.title}
                        </h4>
                        <ul className="space-y-3">
                          {col.links.map((link) => (
                            <li key={link}>
                              <Link to="#" className="text-sm text-gray-600 hover:text-black hover:underline decoration-1 underline-offset-4 transition-colors font-medium">
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {MENU_CONTENT[activeMenu].image && (
                    <div className="w-[300px] flex flex-col items-center text-center">
                      <div className="w-full h-[350px] overflow-hidden bg-gray-100 mb-4">
                        <img src={MENU_CONTENT[activeMenu].image} alt="Featured" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                      </div>
                      <span className="text-xs font-bold tracking-[0.2em] uppercase border-b border-transparent hover:border-black pb-1 cursor-pointer">
                        {MENU_CONTENT[activeMenu].imageCaption}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* MOBILE DRAWER (Slide-in) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#121212] text-white z-[60] overflow-hidden md:hidden shadow-2xl flex flex-col"
            >

              {/* Header: Close Button */}
              <div className="flex justify-between items-center p-5 border-b border-gray-800">
                <X className="w-6 h-6 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
              </div>

              {/* Content Area */}
              <div className="flex-1 relative overflow-hidden">
                <AnimatePresence initial={false} custom={mobileSubMenu}>

                  {/* LEVEL 1: MAIN MENU */}
                  {!mobileSubMenu && (
                    <motion.div
                      key="main-menu"
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'tween', duration: 0.3 }}
                      className="absolute inset-0 overflow-y-auto"
                    >
                      <div className="flex flex-col">
                        {Object.keys(MENU_CONTENT).map((key) => (
                          <button
                            key={key}
                            onClick={() => setMobileSubMenu(key)}
                            className="flex justify-between items-center px-6 py-5 border-b border-gray-800 text-sm font-bold tracking-[0.2em] uppercase hover:bg-gray-900 transition"
                          >
                            {key}
                            <ChevronRight size={16} />
                          </button>
                        ))}
                      </div>

                      {/* Mobile Footer Icons */}
                      <div className="p-8 flex justify-center space-x-8 mt-10">
                        <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center text-[10px]">IG</div>
                        <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center text-[10px]">TT</div>
                      </div>
                    </motion.div>
                  )}

                  {/* LEVEL 2: SUB MENU */}
                  {mobileSubMenu && (
                    <motion.div
                      key="sub-menu"
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'tween', duration: 0.3 }}
                      className="absolute inset-0 bg-[#121212] overflow-y-auto"
                    >
                      {/* Back Button Header */}
                      <button
                        onClick={() => setMobileSubMenu(null)}
                        className="flex items-center w-full px-6 py-5 border-b border-gray-800 text-brand-gold font-bold tracking-[0.2em] text-sm uppercase bg-gray-900"
                      >
                        <ChevronLeft size={16} className="mr-2" />
                        {mobileSubMenu}
                      </button>

                      {/* Sub Links */}
                      <div className="flex flex-col">
                        {MENU_CONTENT[mobileSubMenu].links.map((link) => (
                          <Link
                            key={link}
                            to="#"
                            className="px-6 py-4 border-b border-gray-800 text-sm font-medium tracking-wide text-gray-300 hover:text-white"
                          >
                            {link}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;