import React from 'react';

const Hero = () => {
  return (
    <div className="relative w-full h-[85vh] bg-brand-green overflow-hidden">
      {/* Background Image - Simulating the Green Grunge Wall */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')",
          filter: "brightness(0.7) contrast(1.1)" 
        }} 
      ></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 p-4 pt-20">
        <h1 className="font-display text-6xl md:text-[9rem] leading-none text-brand-gold uppercase drop-shadow-2xl tracking-tighter mb-2">
          Jerry's Gym
        </h1>
        <h2 className="font-display text-4xl md:text-7xl text-white uppercase tracking-widest mb-10 drop-shadow-lg font-bold">
          New Drop
        </h2>
        
        <button className="bg-black text-white px-10 py-4 text-xs font-black tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 border border-black uppercase">
          Shop Now
        </button>
      </div>

      {/* Bottom Left Branding */}
      <div className="absolute bottom-10 left-10 hidden md:block">
         <h3 className="text-brand-gold font-display text-4xl italic tracking-wide">Jerry Cloths</h3>
      </div>
    </div>
  );
};

export default Hero;
