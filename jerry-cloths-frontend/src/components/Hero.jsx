import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/banners');
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    } finally {
      setLoading(false);
    }
  };

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = () => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
  };

  // Auto scroll every 4 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  const handleBannerClick = (link) => {
    if (!link) return;
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      navigate(link);
    }
  };

  if (loading) {
    return <div className="w-full bg-gray-900 animate-pulse" style={{ height: '60vh' }} />;
  }

  if (banners.length === 0) {
    return (
      <div className="w-full bg-gray-900 flex items-center justify-center" style={{ height: '60vh' }}>
        <p className="text-gray-500 text-sm">No banners added yet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: '60vh' }}>
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          onClick={() => handleBannerClick(banner.link)}
          className={`absolute inset-0 transition-opacity duration-700
            ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}
            ${banner.link ? 'cursor-pointer' : ''}`}
        >
          <img
            src={banner.imageUrl}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://placehold.co/1920x600?text=Banner'; }}
          />
        </div>
      ))}

      {/* Left Arrow */}
      {banners.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right Arrow */}
      {banners.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-40 hover:bg-opacity-70 text-white rounded-full transition"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all
                ${index === current ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;