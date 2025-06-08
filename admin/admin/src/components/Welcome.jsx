import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { CounsellorContext } from '../context/CounsellorContext';

const Welcome = () => {
    const navigate = useNavigate()
    const {aToken} = useContext(AdminContext)
    const {cToken}= useContext(CounsellorContext)
    
  useEffect(() => {
    // Add subtle parallax effect to floating shapes
    const handleMouseMove = (e) => {
      const shapes = document.querySelectorAll('.shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const xPos = (x - 0.5) * speed * 20;
        const yPos = (y - 0.5) * speed * 20;
        shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
      });
    };

    // Add smooth entrance animations for buttons
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach((button, index) => {
      setTimeout(() => {
        button.style.animation = `slideUp 0.6s ease-out forwards`;
      }, index * 100);
    });

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div>
        {aToken && <div className="min-h-screen flex items-center justify-center overflow-hidden relative font-sans bg-gradient-to-br from-indigo-50 via-indigo-300 to-indigo-500 pt-10">
      {/* Background animation with floating shapes */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="w-full h-full relative">
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-20 h-20 left-[10%] top-[20%] animate-float"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-32 h-32 right-[10%] top-[30%] animate-float animation-delay-2000"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-16 h-16 left-[20%] bottom-[20%] animate-float animation-delay-4000"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-24 h-24 right-[20%] bottom-[30%] animate-float animation-delay-1000"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="bg-gray-100 bg-opacity-95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center max-w-2xl w-[90%] relative z-10 border border-white border-opacity-30 animate-slideUp">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-300 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold shadow-lg animate-pulse">
          <img className='w-15' src={assets.logo} alt='' />
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-br from-indigo-500 to-indigo-500 bg-clip-text text-transparent">
          What's Happening Today
        </h1>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          Discover the latest activity on Quiet Place platform. See today's appointments, connect with active counsellors, and stay updated with real-time insights from your wellness community.
        </p>

        {/* Navigation grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="nav-button bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-sm opacity-95">Dashboard</span>
          </button>

          <button 
            onClick={() => navigate('/all-appointments')}
            className="nav-button bg-gradient-to-br from-purple-600 to-pink-400 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-sm opacity-95">Appointments</span>
          </button>

          <button 
            onClick={() => navigate('/add-counsellor')}
            className="nav-button bg-gradient-to-br  from-indigo-500 to-purple-600 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">👤</span>
            <span className="text-sm opacity-95">Add Counsellor</span>
          </button>

          <button 
            onClick={() => navigate('/all-counsellors')}
            className="nav-button bg-gradient-to-br from-purple-600 to-pink-400 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">🧑‍⚕️</span>
            <span className="text-sm opacity-95">Counsellors</span>
          </button>
        </div>
      </div>

      </div>}

      {cToken && <div className="min-h-screen flex items-center justify-center overflow-hidden relative font-sans bg-gradient-to-br from-indigo-50 via-indigo-300 to-indigo-500 pt-10">
      {/* Background animation with floating shapes */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="w-full h-full relative">
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-20 h-20 left-[10%] top-[20%] animate-float"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-32 h-32 right-[10%] top-[30%] animate-float animation-delay-2000"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-16 h-16 left-[20%] bottom-[20%] animate-float animation-delay-4000"></div>
          <div className="shape absolute bg-white bg-opacity-10 rounded-full w-24 h-24 right-[20%] bottom-[30%] animate-float animation-delay-1000"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="bg-gray-100 bg-opacity-95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center max-w-2xl w-[90%] relative z-10 border border-white border-opacity-30 animate-slideUp">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-300 rounded-xl mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold shadow-lg animate-pulse">
          <img className='w-15' src={assets.logo} alt='' />
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-br from-indigo-500 to-indigo-500 bg-clip-text text-transparent">
          What's Happening Today
        </h1>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          Discover the latest activity on Quiet Place platform. See today's appointments, connect with your clients, and stay updated with real-time insights from your wellness community.
        </p>

        {/* Navigation grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={() => navigate('/counsellor-dashboard')}
            className="nav-button bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-sm opacity-95">Dashboard</span>
          </button>

          <button 
            onClick={() => navigate('/counsellor-appointments')}
            className="nav-button bg-gradient-to-br from-purple-600 to-pink-400 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-sm opacity-95">Appointments</span>
          </button>

          <button 
            onClick={() => navigate('/counsellor-profile')}
            className="nav-button bg-gradient-to-br  from-indigo-500 to-purple-600 text-white p-6 rounded-xl font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden shadow-lg flex flex-col items-center gap-2 hover:translate-y-[-8px] hover:scale-102 hover:shadow-xl active:translate-y-[-4px] active:scale-98"
          >
            <span className="text-2xl mb-1">👤</span>
            <span className="text-sm opacity-95">Profile</span>
          </button>

        </div>
      </div>

      </div>}
    </div>
  );
};

export default Welcome;