import React from "react";
import { assets } from "../assets/assets";
import { useNavigate} from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-blue-100 mt-16">
      <div className="md:mx-10 px-4">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-16 text-sm">
          {/* Company Info Section */}
          <div className="space-y-4">
            <img 
              onClick={()=> {navigate('/'); scrollTo(0,0)}}
              className="mb-6 w-20 h-10 object-contain" 
              src={assets.logo} 
              alt="BeYou Logo"
            />
            <p className="w-full md:w-2/3 text-gray-700 leading-7 text-base">
              We provide a safe, supportive and non-judgmental space for individuals to access mental health support, whenever and wherever they need it.
            </p>

          </div>

          {/* Company Links Section */}
          <div>
            <p className="text-lg font-semibold mb-6 text-gray-900">COMPANY</p>
            <ul className="flex flex-col gap-3 text-gray-600">
              <li 
                className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer"
                onClick={() => {navigate ('/about'); scrollTo(0,0)}}
              >
                About Us
              </li>
              <li 
                className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer"
                onClick={() => {navigate('/about'); scrollTo(0,0)}}
              >
                Services
              </li>
              <li 
                className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer"
                // onClick={() => }
              >
                Privacy Policy
              </li>
              <li 
                className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer"
                // onClick={() =>}
              >
                Terms of Service
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <p className="text-lg font-semibold mb-6 text-gray-900">GET IN TOUCH</p>
            <ul className="flex flex-col gap-4 text-gray-600">
              <li className="hover:text-blue-600 transition-colors">
                <a href="tel:+233546802849" className="hover:underline">
                  +233-54-680-2849
                </a>
              </li>
              <li className="hover:text-blue-600 transition-colors">
                <a 
                  href="mailto:beyou.support@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  quietplace.support@gmail.com
                </a>
              </li>
              <li className="text-gray-600">
                <span className="leading-6">
                  Kumasi, Ashanti Region<br />
                  Ghana
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              Copyright © 2025 QuietPlace. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600">
              <span 
                className="hover:text-blue-600 cursor-pointer transition-colors"
                // onClick={() =>}
              >
                Privacy Policy
              </span>
              <span 
                className="hover:text-blue-600 cursor-pointer transition-colors"
                // onClick={()}
              >
                Terms of Service
              </span>
              <span 
                className="hover:text-blue-600 cursor-pointer transition-colors"
                // onClick={()=>}
              >
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;