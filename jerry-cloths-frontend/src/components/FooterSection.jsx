import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, CreditCard } from 'lucide-react';

export const Gallery = () => {
  return (
    <div className="py-10 bg-white border-t border-gray-100">
      <div className="px-6 mb-4 flex justify-between items-end max-w-7xl mx-auto">
        <p className="text-sm font-bold text-gray-500 tracking-wide">@jerrycloths</p>
        <button className="text-xs font-black tracking-widest uppercase border-b-2 border-black pb-1 hover:text-brand-gold hover:border-brand-gold transition">
            View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
         <div className="aspect-square bg-black flex items-center justify-center">
            <h2 className="text-white font-display text-4xl md:text-5xl font-bold tracking-tighter">JC</h2>
         </div>
         {[1, 2, 3, 4].map(i => (
           <div key={i} className="aspect-square bg-gray-200 overflow-hidden relative group cursor-pointer">
              <img 
                src={`https://source.unsplash.com/random/500x500?gym,fitness&sig=${i}`} 
                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80"}
                className="object-cover w-full h-full group-hover:opacity-80 transition duration-500" 
                alt="Social Feed"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="text-white w-8 h-8 drop-shadow-lg" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-10 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 text-center md:text-left">
        
        {/* Main Footer Content */}
        <div className="flex flex-col items-center">
          
          <h4 className="font-bold tracking-[0.2em] mb-6 uppercase text-sm">About The Shop</h4>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed max-w-lg text-center">
            Jerry Cloths is a lifestyle clothing brand headquartered in Los Angeles, CA. 
            From start to finish, each product is designed with our customers and quality in mind. 
            We take a much different approach to our products than others. Our goal is not to 
            make products in large quantities, but rather make unique and special products 
            that our customers can wear with pride.
          </p>
          <p className="text-gray-500 text-sm mb-8">Any Questions? (818) 206-8764</p>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mb-10">
            <Instagram className="w-6 h-6 cursor-pointer hover:text-brand-gold transition" />
            <div className="w-6 h-6 flex items-center justify-center font-bold text-xl cursor-pointer hover:text-brand-gold">
               {/* TikTok Icon Placeholder since Lucide doesn't have TikTok by default */}
               <span className="text-sm font-black border border-current rounded p-0.5">Tk</span>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="mb-10">
             <button className="flex items-center space-x-2 text-xs font-bold tracking-widest border border-gray-200 px-4 py-2 rounded hover:border-black transition">
                <span>🇺🇸 UNITED STATES (USD $)</span>
                <span>▼</span>
             </button>
          </div>

          <div className="text-[10px] text-gray-400 font-bold tracking-widest mb-6">
            © 2026 - JERRY CLOTHS
          </div>

          {/* Payment Icons */}
          <div className="flex justify-center flex-wrap gap-2 opacity-60">
             {/* Simple visual representation of payment cards using colored boxes or icons */}
             <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
             <div className="w-10 h-6 bg-black rounded flex items-center justify-center text-[8px] text-white font-bold">Apple</div>
             <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-[8px] text-white font-bold">PayPal</div>
             <div className="w-10 h-6 bg-yellow-500 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
             <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">Master</div>
          </div>

        </div>
      </div>
    </footer>
  );
};