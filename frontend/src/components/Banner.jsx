import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Calendar, Star } from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-2xl mx-4 lg:mx-8 mt-8 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-[400px] lg:min-h-[500px] flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12">
        
        {/* Content Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
          
          {/* Left Section - Book Appointment */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                  Patient Portal
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Book Appointment
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium">
                With 70+ Trusted Counsellors
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-blue-100">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">70+ Counsellors</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">4.9 Rating</span>
              </div>
            </div>

            <button
              onClick={() => handleNavigation("/login")}
              className="group bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto lg:mx-0"
              aria-label="Create account to book appointments"
            >
              Create Account
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Section - Join Team */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                  Professional Portal
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Join Our Team
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-medium">
                Of Certified Counsellors
              </p>
            </div>
            
            {/* Benefits */}
            <div className="space-y-2 text-blue-100">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-sm">Flexible Schedule</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-sm">Professional Growth</span>
              </div>
            </div>

            <button
              onClick={() => handleNavigation("/registration")}
              className="group bg-white/10 hover:bg-white hover:text-blue-600 text-white border-2 border-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto lg:mx-0 backdrop-blur-sm"
              aria-label="Join our team as a counsellor"
            >
              Join Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:ml-8">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-sm"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-300/30 rounded-full blur-sm"></div>
            
            <img
              className="relative z-10 w-80 h-96 object-cover object-center rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              src={assets.appointment_img}
              alt="Professional counsellor ready to help patients"
              loading="lazy"
            />
            
            {/* Floating card */}
            <div className="absolute top-8 -left-8 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Available Now</p>
                  <p className="text-xs text-gray-600">Online Consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image - Shows on smaller screens */}
      <div className="lg:hidden relative mt-8 px-6 pb-6">
        <img
          className="w-full max-w-sm mx-auto h-64 object-cover object-center rounded-xl shadow-lg"
          src={assets.appointment_img}
          alt="Professional counsellor ready to help patients"
          loading="lazy"
        />
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default Banner;