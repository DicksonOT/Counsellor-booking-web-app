
import React from "react";
import { assets } from "../assets/assets";
import { useState, useEffect } from "react";

const Header = () => {
  // const specialtyRef = React.createRef();

  const [imageIndex, setImageIndex] = useState(0);
  const images = [
    assets.header_img,
    assets.header_img2,
    assets.header_img3,
    assets.header_img5,
    assets.header_img1,
    assets.header_img4
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(intervalId);
  }, [images]);

  return (
    <div>
      <div className="relative lg:h-160 w-full rounded-lg px-5 h-[360px]">
        <img
          src={images[imageIndex]}
          alt="Header Image"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition ease-in-out rounded-lg"
        />
        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
        {/* Left side */}
        <div className="absolute z-10 ml-10 mt-35 ">
          <div className="text-white mt-6">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:leading-tight lg:leading-tight">
              Welcome to
              <p className="text-xl md:text-2xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tights text-blue-400">
                Quiet Place,
              </p>
            </p>
            <div>
              <p className="text-sm md:text-base lg:text-2xl">
                a safe, supportive and non-judgmental space <br /> where you
                can take the first step towards mental wellness.
              </p>
              <div className="flex items-center mt-4">
                <img
                  src={assets.group_profiles}
                  alt=""
                  className="mr-2 h-5 w-10"
                />
                <p className="text-sm md:text-base lg:text-lg">
                  Simply browse through for support
                </p>
              </div>
              <a
                href="login"
                className="flex items-center px-5 py-1.5 rounded-full text-blue-400 text-base mt-5 hover:scale-105 transition-all bg-white w-80"
              >
                Seek quick mental support <br />
                <img src={assets.bot} alt="" className="ml-1 w-8 h-8 pb-2" />
                <img src={assets.arrow_icon} alt="" className="ml-2 w-4" />
              </a>
            </div>
          </div>
        </div>
        {/* Right side*/}
        <div className="flex-grow bg-black opacity-0"></div>
      </div>
    </div>
  );
};

export default Header;

