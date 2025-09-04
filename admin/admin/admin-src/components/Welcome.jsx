import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { CounsellorContext } from '../context/CounsellorContext';

const Welcome = () => {
    const navigate = useNavigate()
    const { aToken } = useContext(AdminContext)
    const { cToken } = useContext(CounsellorContext)

    useEffect(() => {
        // Intersection Observer for scroll animations
        const observeElements = () => {
            const cards = document.querySelectorAll('.feature-card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            cards.forEach(card => observer.observe(card));
        };

        // Enhanced parallax effect with multiple layers
        const handleMouseMove = (e) => {
            const shapes = document.querySelectorAll('.floating-shape');
            const particles = document.querySelectorAll('.particle');
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                const xPos = x * speed * 15;
                const yPos = y * speed * 15;
                shape.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${x * speed * 2}deg)`;
            });

            particles.forEach((particle, index) => {
                const speed = (index + 1) * 0.1;
                const xPos = x * speed * 8;
                const yPos = y * speed * 8;
                particle.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        };

        // Morphing background effect
        const createMorphingShapes = () => {
            const container = document.querySelector('.morph-container');
            if (!container) return;

            for (let i = 0; i < 8; i++) {
                const shape = document.createElement('div');
                shape.className = 'morph-shape';
                shape.style.left = Math.random() * 100 + '%';
                shape.style.top = Math.random() * 100 + '%';
                shape.style.animationDelay = Math.random() * 10 + 's';
                shape.style.animationDuration = (8 + Math.random() * 6) + 's';
                container.appendChild(shape);
            }
        };

        // Staggered entrance animations
        const buttons = document.querySelectorAll('.nav-button');
        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.transform = 'translateY(0px) scale(1)';
            }, index * 150);
        });

        // Dynamic CSS injection
        const style = document.createElement('style');
        style.textContent = `
      @keyframes morph {
        0%, 100% { 
          transform: scale(1) rotate(0deg);
          border-radius: 50% 30% 70% 40%;
        }
        25% { 
          transform: scale(1.2) rotate(90deg);
          border-radius: 30% 60% 40% 70%;
        }
        50% { 
          transform: scale(0.8) rotate(180deg);
          border-radius: 60% 40% 30% 70%;
        }
        75% { 
          transform: scale(1.1) rotate(270deg);
          border-radius: 40% 70% 60% 30%;
        }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 197, 253, 0.3); }
      }
      
      @keyframes slide-up {
        from { 
          opacity: 0; 
          transform: translateY(30px) scale(0.95); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0px) scale(1); 
        }
      }
      
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      @keyframes float-in {
        0% {
          opacity: 0;
          transform: translateY(50px) scale(0.8);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes card-reveal {
        0% {
          opacity: 0;
          transform: translateX(-100px) rotateY(-15deg);
        }
        100% {
          opacity: 1;
          transform: translateX(0) rotateY(0deg);
        }
      }
      
      @keyframes glow-pulse {
        0%, 100% {
          background-size: 100% 100%;
        }
        50% {
          background-size: 120% 120%;
        }
      }
      
      @keyframes slide-in-left {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .morph-shape {
        position: absolute;
        width: 120px;
        height: 120px;
        background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.15));
        animation: morph linear infinite;
        filter: blur(1px);
      }
      
      .floating-shape {
        animation: float 6s ease-in-out infinite;
      }
      .floating-shape:nth-child(2) { animation-delay: -2s; }
      .floating-shape:nth-child(3) { animation-delay: -4s; }
      .floating-shape:nth-child(4) { animation-delay: -1s; }
      .floating-shape:nth-child(5) { animation-delay: -3s; }
      
      .feature-card {
        opacity: 0;
        transform: translateX(-100px) rotateY(-15deg);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .feature-card.visible {
        opacity: 1;
        transform: translateX(0) rotateY(0deg);
        animation: card-reveal 0.8s ease-out forwards;
      }
      
      .feature-card:nth-child(even) {
        transform: translateX(100px) rotateY(15deg);
      }
      
      .nav-button {
        opacity: 0;
        transform: translateY(20px) scale(0.9);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hero-content {
        animation: float-in 1.2s ease-out forwards;
      }
      
      .nav-grid {
        animation: float-in 1.5s ease-out 0.3s both;
      }
      
      .glow-effect {
        background: linear-gradient(45deg, #3B82F6, #60A5FA, #93C5FD, #DBEAFE);
        background-size: 300% 300%;
        animation: glow-pulse 3s ease-in-out infinite;
      }
      
      .sidebar-enter {
        animation: slide-in-left 0.6s ease-out forwards;
      }
      
      .card-hover-effect:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 25px 50px rgba(59, 130, 246, 0.3);
      }
      
      .text-shadow-custom {
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
      }
      
      .main-container {
        animation: slide-up 0.8s ease-out forwards;
      }
      
      .gradient-bg {
        background: linear-gradient(-45deg, #1e3a8a, #3b82f6, #60a5fa, #93c5fd);
        background-size: 400% 400%;
        animation: gradient-shift 15s ease infinite;
      }
      
      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
    `;
        document.head.appendChild(style);

        observeElements();
        createMorphingShapes();
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    const AdminDashboard = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden">
            {/* Morphing Background */}
            <div className="morph-container absolute inset-0 pointer-events-none opacity-20" />

            {/* Geometric Pattern Overlay - Pyramids */}
            <div className="absolute inset-0 opacity-15">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="pyramids" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
                            <polygon fill="#3B82F6" points="60,10 100,90 20,90" opacity="0.3" />
                            <polygon fill="#1E40AF" points="60,10 80,50 40,50" opacity="0.6" />
                            <polygon fill="#1D4ED8" points="20,90 60,30 100,90" opacity="0.2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pyramids)" />
                </svg>
            </div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="floating-shape absolute w-24 h-24 bg-white bg-opacity-10 rounded-full blur-sm left-[10%] top-[15%]" />
                <div className="floating-shape absolute w-36 h-36 bg-blue-200 bg-opacity-15 rounded-full blur-sm right-[15%] top-[25%]" />
                <div className="floating-shape absolute w-20 h-20 bg-white bg-opacity-12 rounded-full blur-sm left-[25%] bottom-[25%]" />
                <div className="floating-shape absolute w-28 h-28 bg-blue-100 bg-opacity-20 rounded-full blur-sm right-[25%] bottom-[35%]" />
                <div className="floating-shape absolute w-16 h-16 bg-white bg-opacity-8 rounded-full blur-sm left-[60%] top-[10%]" />

                {/* Particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1 h-1 bg-white bg-opacity-30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <div className="sidebar-enter w-80 bg-blue-600 p-8 shadow-2xl relative">
                    <div className="absolute inset-0 bg- bg-opacity-20" />
                    <div className="relative z-10">
                        {/* Logo Section */}
                        <div className="text-center mb-12">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 glow-effect rounded-xl mx-auto flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform duration-300 animate-pulse-glow">
                                    <img className='w-12 h-12 object-contain drop-shadow-lg' src={assets.logo} alt='Quiet Place Logo' />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mt-6 text-shadow-custom">Admin Portal</h2>
                            <div className="w-16 h-1 bg-blue-400 mx-auto mt-3 rounded-full" />
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-4">
                            {[
                                { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
                                { icon: '📅', label: 'Appointments', path: '/all-appointments' },
                                { icon: '👨‍⚕️', label: 'Add Counsellor', path: '/add-counsellor' },
                                { icon: '👥', label: 'All Counsellors', path: '/all-counsellors' },
                                { icon: '⏳', label: 'Pending Approvals', path: '/approve-counsellors' },
                                { icon: '🎯', label: 'Programs', path: '/programs' },
                                { icon: '💝', label: 'Donations', path: '/donations' }
                            ].map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className="nav-button w-full text-left p-4 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 group border border-white border-opacity-20 hover:border-opacity-40"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </button>
                            ))}
                        </nav>

                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="hero-content text-center mb-16">
                            <h1 className="text-6xl font-bold mb-6 text-shadow-custom">
                                <span className="bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-700 bg-clip-text text-transparent">
                                    Admin Command Center
                                </span>
                            </h1>
                            <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Orchestrate your wellness ecosystem with precision and insight.
                                <span className="block mt-2 text-xl text-blue-700">Your platform's success starts here.</span>
                            </p>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-800 mb-2">24/7</div>
                                    <div className="text-gray-600">System Monitoring</div>
                                </div>
                                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-200">
                                    <div className="text-3xl font-bold text-indigo-800 mb-2">∞</div>
                                    <div className="text-gray-600">Scalable Infrastructure</div>
                                </div>
                                <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200">
                                    <div className="text-3xl font-bold text-blue-800 mb-2">100%</div>
                                    <div className="text-gray-600">Data Security</div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Cards */}
                        <div className="nav-grid grid grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Real-time Analytics',
                                    description: 'Monitor platform performance with live metrics and comprehensive reporting tools.',
                                    icon: '📈',
                                    gradient: 'from-blue-500 to-indigo-500'
                                },
                                {
                                    title: 'User Management',
                                    description: 'Efficiently manage counsellors, clients, and administrative personnel.',
                                    icon: '👥',
                                    gradient: 'from-indigo-500 to-blue-500'
                                },
                                {
                                    title: 'Appointment Oversight',
                                    description: 'Complete visibility and control over all scheduling and session management.',
                                    icon: '🗓️',
                                    gradient: 'from-blue-500 to-blue-600'
                                },
                                {
                                    title: 'Quality Assurance',
                                    description: 'Maintain the highest standards through continuous monitoring and feedback.',
                                    icon: '⭐',
                                    gradient: 'from-blue-600 to-indigo-600'
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-card card-hover-effect bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200 transition-all duration-500"
                                >
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white text-3xl mb-6 shadow-lg`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const CounsellorDashboard = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden">
            {/* Morphing Background */}
            <div className="morph-container absolute inset-0 pointer-events-none opacity-20" />

            {/* Geometric Pattern Overlay - Pyramids */}
            <div className="absolute inset-0 opacity-15">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="pyramids-counsellor" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
                            <polygon fill="#3B82F6" points="60,10 100,90 20,90" opacity="0.3" />
                            <polygon fill="#1E40AF" points="60,10 80,50 40,50" opacity="0.6" />
                            <polygon fill="#1D4ED8" points="20,90 60,30 100,90" opacity="0.2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pyramids-counsellor)" />
                </svg>
            </div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="floating-shape absolute w-24 h-24 bg-white bg-opacity-10 rounded-full blur-sm left-[10%] top-[15%]" />
                <div className="floating-shape absolute w-36 h-36 bg-blue-200 bg-opacity-15 rounded-full blur-sm right-[15%] top-[25%]" />
                <div className="floating-shape absolute w-20 h-20 bg-white bg-opacity-12 rounded-full blur-sm left-[25%] bottom-[25%]" />
                <div className="floating-shape absolute w-28 h-28 bg-blue-100 bg-opacity-20 rounded-full blur-sm right-[25%] bottom-[35%]" />
                <div className="floating-shape absolute w-16 h-16 bg-white bg-opacity-8 rounded-full blur-sm left-[60%] top-[10%]" />

                {/* Particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1 h-1 bg-white bg-opacity-30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="flex min-h-screen">
                {/* Left Sidebar */}
                <div className="sidebar-enter w-80 bg-blue-500 p-8 shadow-2xl relative">
                    <div className="absolute inset-0 bg-opacity-10" />
                    <div className="relative z-10">
                        {/* Logo Section */}
                        <div className="text-center mb-12">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 glow-effect rounded-xl mx-auto flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform duration-300 animate-pulse-glow">
                                    <img className='w-12 h-12 object-contain drop-shadow-lg' src={assets.logo} alt='Quiet Place Logo' />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mt-6 text-shadow-custom">Counsellor Hub</h2>
                            <div className="w-16 h-1 bg-blue-400 mx-auto mt-3 rounded-full" />
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-4">
                            {[
                                { icon: '📊', label: 'Dashboard', path: '/counsellor-dashboard' },
                                { icon: '📅', label: 'Appointments', path: '/counsellor-appointments' },
                                { icon: '✨', label: 'Create Activity', path: '/community' },
                                { icon: '👤', label: 'Profile', path: '/counsellor-profile' },
                                { icon: '🎯', label: 'Moderate Program', path: '/counsellor-chat' }
                            ].map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className="nav-button w-full text-left p-4 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 group border border-white border-opacity-20 hover:border-opacity-40"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </button>
                            ))}
                        </nav>

                    </div>
                    {/* Footer */}
                    <div className="absolute left-8 right-8">
                        <p className="text-sm  text-center opacity-80 mt-15">
                            "Making a difference, one conversation at a time"
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="hero-content text-center mb-16">
                            <h1 className="text-5xl font-bold mb-6 text-shadow-custom">
                                <span className="bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-700 bg-clip-text text-transparent">
                                    Your Healing Space
                                </span>
                            </h1>
                            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Step into your digital practice where compassion meets technology.
                                <span className="block mt-2 text-lg text-blue-700">Every session matters, every connection heals.</span>
                            </p>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="nav-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                            {[
                                {
                                    title: 'Session Management',
                                    description: 'Schedule, manage, and review all your client appointments with ease',
                                    icon: '📅',
                                    path: '/counsellor-appointments',
                                    color: 'blue'
                                },
                                {
                                    title: 'Therapeutic Activities',
                                    description: 'Design and create personalized therapeutic exercises for your clients',
                                    icon: '✨',
                                    path: '/community',
                                    color: 'indigo'
                                },
                                {
                                    title: 'Professional Profile',
                                    description: 'Manage your credentials, specialties, and professional information',
                                    icon: '👤',
                                    path: '/counsellor-profile',
                                    color: 'white'
                                },
                                {
                                    title: 'Clients',
                                    description: 'View and manage your clients with ease',
                                    icon: '👥',
                                    path: '/clients',
                                    color: 'blue'
                                },
                                {
                                    title: 'Program Oversight',
                                    description: 'Monitor and moderate wellness programs under your supervision',
                                    icon: '🎯',
                                    path: '/moderate-program',
                                    color: 'indigo'
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="feature-card card-hover-effect bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 transition-all duration-500 overflow-hidden group cursor-pointer"
                                    onClick={() => navigate(item.path)}
                                >
                                    <div className={`h-2 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`} />
                                    <div className="p-8">
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className={`w-16 h-16 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                                <p className="text-gray-600 text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className={`h-1 bg-gradient-to-r from-${item.color}-200 to-${item.color}-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Wellness Metrics */}
                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Impact Today</h3>
                            <div className="grid grid-cols-4 gap-6 text-center">
                                <div className="p-6">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                                    <div className="text-gray-600 text-sm">Sessions Scheduled</div>
                                    <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                                        <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-3xl font-bold text-indigo-600 mb-2">5.0</div>
                                    <div className="text-gray-600 text-sm">Average Rating</div>
                                    <div className="flex justify-center mt-3 gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">⭐</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {aToken && <AdminDashboard />}
            {cToken && <CounsellorDashboard />}
        </div>
    );
};

export default Welcome;