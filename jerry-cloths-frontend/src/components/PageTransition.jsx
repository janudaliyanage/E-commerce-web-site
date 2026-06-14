import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fadeIn');

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut');
        }
    }, [location, displayLocation]);

    return (
        <div
            className={`transition-all duration-300 ${transitionStage === 'fadeIn' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
            onTransitionEnd={() => {
                if (transitionStage === 'fadeOut') {
                    setDisplayLocation(location);
                    setTransitionStage('fadeIn');
                    window.scrollTo(0, 0);
                }
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;