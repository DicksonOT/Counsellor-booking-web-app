import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative lg:h-80 rounded-lg px-5 grid bg-cover bg-blue-400 mt-15">
      {/* Left side  */}
      <div className="flex-1 py-8 sm:py-10 md-py-16 lg:py-24 lg:pl-25">
        <div className="text-xl sm:text-2x1 md:text-3x1 lg:text-5x1 font-semibold text-white ml-15">
          <p>Book Appointment</p>
          <p className="mt-4">With 70+ trusted Counsellors</p>
        </div>
        <button
          onClick={() => {
            navigate("login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all cursor-pointer ml-15"
        >
          Create Account
        </button>
      </div>

      {/* Left side  */}
      <div className="hidden md:block ">
        <img
          className="w-130 absolute ml-130 bottom-0  h-90"
          src={assets.appointment_img}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
