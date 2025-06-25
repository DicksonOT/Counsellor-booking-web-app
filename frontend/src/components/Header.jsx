import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect, useCallback } from "react";

const Header = () => {
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Quiet Place,";
  
  const typeAndDelete = useCallback(() => {
    let index = 0;
    setIsDeleting(false);
    
    // Typing phase
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        
        setTimeout(() => {
          setIsDeleting(true);
          let deleteIndex = fullText.length;

          const deletingInterval = setInterval(() => {
            if (deleteIndex >= 0) {
              setTypedText(fullText.slice(0, deleteIndex));
              deleteIndex--;
            } else {
              clearInterval(deletingInterval);
              setIsDeleting(false);
              
              setTimeout(() => {
                typeAndDelete();
              }, 500);
            }
          }, 100);
        }, 7000);
      }
    }, 150);
  }, [fullText]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      typeAndDelete();
    } else {
      setTypedText(fullText);
    }

    return () => {
      setTypedText("");
    };
  }, [typeAndDelete, fullText]);

  return (
    <div>
      <div className="relative h-[360px] lg:h-[640px] w-full px-5">
       
        <video 
          autoPlay
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          aria-label="Background video"
        >
          <source src={assets.welcomeVid} type="video/mp4"/>
        </video>

        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
        
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="ml-4 md:ml-8 lg:ml-12 text-white max-w-2xl">
            <div className="mb-6">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Welcome to
              </p>
              <p className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight text-blue-400">
                {typedText}
                <span className="animate-pulse" aria-hidden="true">|</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm md:text-base lg:text-xl leading-relaxed">
                a safe, supportive and non-judgmental space <br /> 
                where you can take the first step towards mental wellness.
              </p>
              
              <div className="flex items-center">
                <img
                  src={assets.group_profiles}
                  alt="Group of people"
                  className="mr-3 h-5 w-10"
                />
                <p className="text-sm md:text-base lg:text-lg">
                  Simply browse through for support
                </p>
              </div>
              
              <a
                href="/bot"
                className="inline-flex items-center px-6 py-3 rounded-full text-blue-600 text-base font-medium mt-6 hover:scale-105 transition-all duration-200 bg-white shadow-lg hover:shadow-xl max-w-fit"
                role="button"
                aria-label="Get mental health support"
              >
                <span>Seek quick mental support</span>
                <img 
                  src={assets.bot} 
                  alt="" 
                  className="ml-2 w-6 h-6" 
                  aria-hidden="true"
                />
                <img 
                  src={assets.arrow_icon} 
                  alt="" 
                  className="ml-2 w-4 h-4" 
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;