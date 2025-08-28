import React from "react";
import { ArrowRight, Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpUsHelpOthers = () => {
  const navigate = useNavigate()
  const handleDonationClick = () => {
    navigate('/donate')
    window.scrollTo(0,0)
    if (window.onDonationClick) {
      window.onDonationClick();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 lg:mx-8 mt-8 shadow-2xl text-blue-700">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: `url('https://www.shutterstock.com/image-vector/charity-icons-set-collection-hands-600nw-2348498613.jpg')`
        }}
      >
        {/* Blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-50/90"></div>
      </div>

      {/* Additional Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-[300px] flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12">
        
        {/* Content Container */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <Heart className="h-5 w-5 fill-current" />
              <span className="text-sm font-medium uppercase tracking-wide">
                Make a Difference
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Help Us Help Others
            </h2>
            <p className="text-lg sm:text-xlfont-medium max-w-2xl">
              Your donation supports free mental health services for those who need it most
            </p>
          </div>
          
          {/* Impact Stats */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">2,500+</div>
                <div className="text-xs">Lives Touched</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 fill-current" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">89%</div>
                <div className="text-xs">Success Rate</div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleDonationClick}
            className="group bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto lg:mx-0"
          >
            Donate Now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Success Story Preview */}
        <div className="hidden lg:block lg:flex-shrink-0 lg:ml-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-full blur-sm"></div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-sm">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                  <Heart className="h-8 w-8 text-blue-600 fill-current" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Sarah's Journey</h3>
                <p className="text-sm text-gray-600">
                  "Thanks to the free counseling program, I found hope again after losing my job."
                </p>
                <div className="flex justify-center text-yellow-400">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </div>
  );
};

export default HelpUsHelpOthers;