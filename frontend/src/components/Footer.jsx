import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate=useNavigate()

  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-35 text-sm">
        {/* Left section */}
        <div>
            <img className="mb-5 w-22 h-10" src={assets.logo} alt=""/>
            <p className="w-full md:w-2/3 text-gray-600 leading-6">We provide a safe, supportive and non-judgmental space for individuals to access mental health support, whenever and wherever they need it.</p>
        </div>

        {/* Left section */}
        <div>
            <p className="text-base font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600 cursor-pointer">
                <li  onClick={()=> {navigate('/'), scrollTo(0,0)}}>Home</li>
                <li onClick={()=> {navigate('/about'), scrollTo(0,0)}}>About Us</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        {/* Left section */}
        <div>
            <p className="text-base font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
                <li>+233-54-680-2849</li>
                <li> <a href="mailto:dikxoseitutu@gmail.com" target="_blank"> quietplace@gmail.com</a></li>
            </ul>
        </div>
      </div>

      <div>
        <hr/>
        <p>Copyright 2025@BeYou -All Right Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
