import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets'; // Add this import

const OurTeam = () => {
  const {team} = useContext(AppContext)

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 px-4 md:px-8 lg:px-20 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Meet Our Team
        </h1>
        <hr className="border-t-2 border-blue-400 my-4 w-16 mx-auto"/>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Our dedicated team of mental health professionals and technology experts work together to provide you with the best care possible.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {team.map((member) => (
          <div 
            key={member.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
          >
            {/* Card Content */}
            <div className="p-8 text-center">
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <img 
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300" 
                    src={member.image} 
                    alt={`${member.name} profile`}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {member.about}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                {/* LinkedIn - Show for all members who have linkedin */}
                {member.linkedin && (
                  <button
                    onClick={() => handleLinkClick(member.linkedin)}
                    className="w-10 h-10 bg-blue-100 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group/btn hover:scale-110"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <img className="w-5 h-5" src={assets.linkedin} alt="LinkedIn" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;