import React, { useState, useEffect, useCallback, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const {userData} = useContext(AppContext)
  const [imageIndex, setImageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Quiet Place,";
  
  const names = userData.name
  
  const images = [
    assets.header_img,
    assets.header_img2,
    assets.header_img3,
    assets.header_img5,
    assets.header_img1,
    assets.header_img4
  ];

  // Image slideshow effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [images.length]);

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
        }, 5000);
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
      <div className="relative h-[360px] lg:h-[900px] w-full px-5">
        <img
          src={images[imageIndex]}
          alt="Header background showcasing mental wellness"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out rounded-lg"
        />
        <div className="absolute inset-0 bg-black opacity-15 rounded-lg"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="ml-4 md:ml-8 lg:ml-12 text-white max-w-2xl">
            <div className="mb-6">
              <p className="text-xl md:text-5xl lg:text-8xl font-bold leading-tight">
                Welcome to
              </p>
              <p className="text-5xl md:text-4xl lg:text-6xl font-bold leading-tight text-blue-400">
                {typedText}
                <span className="animate-pulse" aria-hidden="true">|</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm md:text-base lg:text-3xl leading-relaxed">
                a safe, supportive and non-judgmental space <br /> 
                where you can take the first step towards mental wellness.
              </p>
              
              <div className="flex items-center">
                <img
                  src={assets.group_profiles}
                  alt="Community support"
                  className="mr-3 h-5 w-10 rounded"
                />
                <p className="text-sm md:text-base lg:text-lg">
                  Simply browse through for support
                </p>
              </div>
              
              <a
                href="/bot"
                className="inline-flex items-center rounded-full text-blue-600 text-xl font-medium mt-6 hover:scale-105 transition-all duration-200 bg-white shadow-lg hover:shadow-xl max-w-fit px-3"
                role="button"
                aria-label="Get mental health support"
              >
                <img 
                  src={assets.bot} 
                  alt="" 
                  className="ml-1 w-13 h-10 rounded-t-3xl mb-5" 
                  aria-hidden="true"
                />
                <span>Hi, {names? names.split(' ')[0] : 'there'}. I'm ready to chat.</span>
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
