import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { assets } from '../assets/assets';

const FullScreenVideoApp = () => {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasTriggered, setHasTriggered] = useState(false);
  const videoRef = useRef(null);
  const triggerRef = useRef(null);

  // Random dot positions generated once
  const [dotStyles] = useState(() =>
    [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }))
  );

  // Intersection Observer to trigger video once in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setIsVideoVisible(true);
            setHasTriggered(true);
            setIsPlaying(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [hasTriggered]);

  // ESC key closes video
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeVideo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autoplay video when visible
  useEffect(() => {
    if (isVideoVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        console.warn("Autoplay blocked");
      });
    }
  }, [isVideoVisible]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const closeVideo = () => {
    setIsVideoVisible(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const openFullScreenVideo = () => {
    setIsVideoVisible(true);
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center">
      {/* Trigger Section */}
      <section
        ref={triggerRef}
        onClick={hasTriggered ? openFullScreenVideo : undefined}
        className={`max-w-2xl mx-auto relative overflow-hidden ${hasTriggered ? 'cursor-pointer' : ''} group`}
      >
        <div className="absolute inset-0 rounded-3xl">
          {dotStyles.map((style, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={style}
            ></div>
          ))}
        </div>

        <div className="relative z-10 text-center p-8 md:p-12">
          <div className={`bg-blue-400 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 transition-all duration-300 ${hasTriggered ? 'group-hover:bg-blue-500 group-hover:scale-105' : ''
            }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              🎬 Watch Our Story
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Your healing journey is not a race; it is a profound act of courage. Be gentle with yourself, for every step is a testament to your strength.
            </p>

            {hasTriggered && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-white/80 group-hover:text-white transition-colors">
                <Play className="w-5 h-5" />
                <span className="text-sm font-medium">Click to watch again</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Screen Video Overlay */}
      {isVideoVisible && (
        <div
          className={`fixed inset-0 bg-black z-50 transition-all duration-1000 ease-out ${isVideoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          style={{
            animation: isVideoVisible ? 'slideInFromTopRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : ''
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            onEnded={handleVideoEnd}
            poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdlZWEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg=="
          >
            <source src={assets.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Control Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none">
            {/* Top Right Close */}
            <div className="absolute top-6 right-6 flex items-center space-x-4 pointer-events-auto">
              <button
                onClick={closeVideo}
                className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-lg"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 pointer-events-auto">
              <button
                onClick={togglePlayPause}
                className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-lg"
                aria-label="Play or Pause"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>

              <button
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-lg"
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
              </button>
            </div>

            {/* Title and Description */}
            <div className="absolute bottom-24 left-8 pointer-events-none">
              <h3 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Our Vision
              </h3>
              <p className="text-lg text-white/80 max-w-md">
                Revolutionize mental health support by providing accessible, affordable, and compassionate care to individuals worldwide.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInFromTopRight {
          0% {
            transform: translate(100%, -100%) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translate(0, 0) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FullScreenVideoApp;
