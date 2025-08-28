import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets'; // Assuming you have bot gif in assets

const FloatingBotWithGif = ({ onBotClick, isLoggedIn, currentPath }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Hide floating bot on login page and bot page itself
  const hiddenRoutes = ['/login', '/bot'];
  const shouldShow = !hiddenRoutes.includes(currentPath);

  useEffect(() => {
    // Stop the waving animation after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show pulse effect periodically to grab attention
    const pulseInterval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 10000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleClick = () => {
    if (!isLoggedIn) {
      onBotClick('login');
      return;
    }
    onBotClick('bot');
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Bot Button Container */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 group"
        style={{
          width: '70px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Bot GIF/Image */}
        <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
          {assets.bot ? (
            <img 
              src={assets.bot} 
              alt="QuietPlace Bot" 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="text-3xl">🤖</div>
          )}
        </div>

        {/* Waving Hand Animation */}
        {isAnimating && (
          <div className="absolute -top-3 -right-3 animate-pulse">
            <div className="bg-yellow-400 rounded-full p-1 shadow-lg">
              <span className="text-lg">👋</span>
            </div>
          </div>
        )}

        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl shadow-lg whitespace-nowrap transform transition-all duration-200">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span>Hi! I'm ready to help</span>
            </div>
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      {/* Animated Rings */}
      {showPulse && (
        <>
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-blue-300 opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}

      {/* Quick Action Menu (appears on hover) */}
      <div className="absolute bottom-20 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="bg-white rounded-xl shadow-xl p-2 min-w-[200px]">
          <div className="text-sm text-gray-600 font-medium mb-2 px-2">Quick Actions</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-lg">💭</span>
            <span className="text-sm text-gray-700">Start Chat</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add quick help action
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-lg">❓</span>
            <span className="text-sm text-gray-700">Quick Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingBotWithGif;