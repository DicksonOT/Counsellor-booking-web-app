import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const { token, setToken, userData } = useContext(AppContext)
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    const navigationItems = [
        {
            title: 'Services',
            items: [
                {
                    name: 'Online Therapy',
                    path: '/sessions',
                    description: 'Individual & group sessions',
                    features: ['Secure', 'Licensed', 'Confidential']
                },
                {
                    name: 'Crisis Support',
                    path: '/crisis-support',
                    description: '24/7 emergency help',
                    features: ['Immediate', 'Emergency', 'Always Open']
                },
                {
                    name: 'Wellness Programs',
                    path: '/wellness-programs',
                    description: 'Self-care & mindfulness',
                    features: ['Guided', 'Interactive', 'Progressive']
                },
                {
                    name: 'Assessments',
                    path: '/screening',
                    description: 'Mental health screening',
                    features: ['Professional', 'Secure', 'Comprehensive']
                }
            ]
        },
        {
            title: 'Resources',
            items: [
                {
                    name: 'Mental Health Library',
                    path: '/library',
                    description: 'Articles & guides',
                    features: ['Evidence-based', 'Updated', 'Expert-reviewed']
                },
                {
                    name: 'Wellness Activities',
                    path: '/activity',
                    description: 'Activities created by counsellors',
                    features: ['Short-term (1 week or less)', 'Counsellor-guided', 'Interactive']
                },
                {
                    name: 'Support Groups',
                    path: '/communities',
                    description: 'Community forums',
                    features: ['Moderated', 'Safe space', 'Anonymous']
                },
                {
                    name: 'Meditation Center',
                    path: '/meditation-center',
                    description: 'Guided sessions',
                    features: ['Guided', 'Various lengths', 'On-demand']
                }
            ]
        },
        {
            title: 'Professionals',
            items: [
                {
                    name: 'Find a Counsellor',
                    path: '/counsellors',
                    description: 'Licensed counselors',
                    features: ['Licensed', 'Background-checked', 'Experienced']
                },
                {
                    name: 'Join Our Team of Counsellors',
                    path: '/registration',
                    description: 'Work with us',
                    features: ['Rewarding', 'Flexible', 'Impactful']
                },
                {
                    name: 'Donations',
                    path: '/donate',
                    description: 'Support mental health programs and initiatives',
                    features: ['Secure Payments', 'Transparent', 'Impactful']
                }
            ]
        }
    ]

    const handleMouseEnter = (index) => {
        setActiveDropdown(index)
    }

    const handleMouseLeave = () => {
        setActiveDropdown(null)
    }

    return (
        <div className='fixed top-0 left-0 z-50 w-full bg-white flex items-center justify-between text-sm py-6 px-8 border-b border-gray-200 shadow-lg'>
            {/* Logo Section */}
            <div
                onClick={() => { navigate('/'); window.scrollTo(0, 0) }}
                className='flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200'
            >
                <img className='w-12 h-12 object-contain' src={assets.logo} alt='Quiet Place Logo' />
                <div className='ml-4'>
                    <p className='text-blue-600 text-2xl font-bold tracking-wide'>Quiet Place</p>
                    <p className='text-xs text-gray-500 font-medium'>Mental Health Support Platform</p>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-10'>
                <ul className='flex items-center gap-8 font-medium'>
                    <NavLink to='/' onClick={() => window.scrollTo(0, 0)} className={({ isActive }) =>
                        `relative py-3 px-4 transition-colors duration-200 hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-700'
                        }`
                    }>
                        {({ isActive }) => (
                            <>
                                <li className='text-base'>HOME</li>
                                {isActive && <hr className='absolute bottom-0 left-0 right-0 border-blue-600 border-t-2' />}
                            </>
                        )}
                    </NavLink>

                    {navigationItems.map((navItem, index) => (
                        <div
                            key={index}
                            className='relative'
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className='flex items-center py-3 px-4 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium'>
                                <span className='text-base'>{navItem.title.toUpperCase()}</span>
                                <svg
                                    className={`ml-2 w-4 h-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Enhanced Dropdown Menu */}
                            <div className={`absolute top-full left-0 mt-3 w-96 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden transition-all duration-200 ${activeDropdown === index ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                                }`}>
                                <div className='py-3'>
                                    {navItem.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            onClick={() => { navigate(item.path); window.scrollTo(0, 0) }}
                                            className='px-5 py-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-50 last:border-b-0'
                                        >
                                            <div className='flex justify-between items-start mb-2'>
                                                <div className='font-semibold text-gray-900 hover:text-blue-600 text-base'>{item.name}</div>
                                            </div>
                                            <div className='text-sm text-gray-600 mb-2'>{item.description}</div>
                                            <div className='flex flex-wrap gap-1'>
                                                {item.features.map((feature, featureIndex) => (
                                                    <span key={featureIndex} className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <NavLink to='/about' onClick={() => window.scrollTo(0, 0)} className={({ isActive }) =>
                        `relative py-3 px-4 transition-colors duration-200 hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-700'
                        }`
                    }>
                        {({ isActive }) => (
                            <>
                                <li className='text-base'>ABOUT</li>
                                {isActive && <hr className='absolute bottom-0 left-0 right-0 border-blue-600 border-t-2' />}
                            </>
                        )}
                    </NavLink>
                </ul>

                {/* Enhanced Auth Buttons */}
                <div className='flex items-center gap-4'>
                    {token ? (
                        <div className='flex items-center cursor-pointer group relative'>
                            <div className='flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200'>
                                <img
                                    className='rounded-full w-10 h-10 object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200'
                                    src={userData?.image || assets.default_avatar}
                                    alt='Profile'
                                />
                                <div className='ml-3'>
                                    <span className='block font-semibold text-gray-700 group-hover:text-blue-600'>
                                        {userData?.name || 'User'}
                                    </span>
                                </div>
                                <svg
                                    className='ml-3 w-5 h-5 group-hover:rotate-180 transition-transform duration-200 text-gray-500'
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <div className='absolute top-full right-0 mt-3 text-base font-medium text-gray-600 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                                <div className='min-w-56 bg-white border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden'>
                                    <p
                                        onClick={() => navigate('/my-profile')}
                                        className='px-5 py-4 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100 flex items-center'
                                    >
                                        <svg className='w-5 h-5 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div>
                                            <div className='font-medium'>My Profile</div>
                                            <div className='text-xs text-gray-500'>Personal settings</div>
                                        </div>
                                    </p>
                                    <p
                                        onClick={() => navigate('/my-appointment')}
                                        className='px-5 py-4 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100 flex items-center'
                                    >
                                        <svg className='w-5 h-5 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2m-6 0V7" />
                                        </svg>
                                        <div>
                                            <div className='font-medium'>My Appointments</div>
                                            <div className='text-xs text-gray-500'>Therapy appointments</div>
                                        </div>
                                    </p>
                                    <p
                                        onClick={() => navigate('/assessments')}
                                        className='px-5 py-4 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100 flex items-center'
                                    >
                                        <svg className='w-5 h-5 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <div>
                                            <div className='font-medium'>My Assessments</div>
                                            <div className='text-xs text-gray-500'>Mental health evaluations</div>
                                        </div>
                                    </p>
                                    <p
                                        onClick={logout}
                                        className='px-5 py-4 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200 text-red-500 flex items-center'
                                    >
                                        <svg className='w-5 h-5 mr-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <div>
                                            <div className='font-medium'>Logout</div>
                                            <div className='text-xs text-red-400'>Sign out securely</div>
                                        </div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => navigate('/login')}
                                className='px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer transition-colors duration-200 border border-blue-200 rounded-lg hover:bg-blue-50'
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className='rounded-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>

                {/* Security & Status Indicators */}
                <div className='hidden lg:flex items-center space-x-4 ml-4 border-l border-gray-200 pl-4'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span className='text-xs text-gray-600 font-medium'>24/7 Live</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <svg className='w-4 h-4 text-green-600' fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className='text-xs text-gray-600 font-medium'>Secured</span>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <img
                className='w-7 h-7 lg:hidden cursor-pointer hover:opacity-70 transition-opacity duration-200'
                onClick={() => setShowMenu(true)}
                src={assets.menu_icon}
                alt='Menu'
            />

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
                    onClick={() => setShowMenu(false)}
                />
            )}

            {/* Enhanced Mobile Menu */}
            <div className={`${showMenu ? 'translate-x-0' : 'translate-x-full'
                } fixed right-0 top-0 h-full w-80 max-w-sm bg-white z-40 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto`}>

                {/* Mobile Menu Header */}
                <div className='flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-blue-50'>
                    <div className='flex items-center'>
                        <img className='w-10 h-10 object-contain' src={assets.logo} alt='Logo' />
                        <div className='ml-3'>
                            <p className='text-blue-600 text-lg font-bold'>Quiet Place</p>
                            <p className='text-xs text-gray-600'>Mental Health Platform</p>
                        </div>
                    </div>
                    <img
                        className='w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity duration-200'
                        onClick={() => setShowMenu(false)}
                        src={assets.cross_icon}
                        alt='Close'
                    />
                </div>

                {/* Mobile Menu Links */}
                <div className='flex flex-col px-6 py-4'>
                    <NavLink
                        onClick={() => { setShowMenu(false); window.scrollTo(0, 0) }}
                        to='/'
                        className={({ isActive }) =>
                            `px-4 py-3 rounded-lg text-base font-medium mb-3 transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    {navigationItems.map((navItem, index) => (
                        <div key={index} className='mb-6'>
                            <div className='flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-800 uppercase tracking-wide bg-gray-50 rounded-lg'>
                                <span>{navItem.title}</span>
                            </div>
                            {navItem.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    onClick={() => { navigate(item.path); setShowMenu(false); window.scrollTo(0, 0) }}
                                    className='px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 rounded-lg mx-2 mb-2'
                                >
                                    <div className='flex justify-between items-start mb-1'>
                                        <div className='font-semibold'>{item.name}</div>
                                    </div>
                                    <div className='text-xs text-gray-600 mb-2'>{item.description}</div>
                                    <div className='flex flex-wrap gap-1'>
                                        {item.features.slice(0, 2).map((feature, featureIndex) => (
                                            <span key={featureIndex} className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full'>
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <NavLink
                        onClick={() => { setShowMenu(false); window.scrollTo(0, 0) }}
                        to='/about'
                        className={({ isActive }) =>
                            `px-4 py-3 rounded-lg text-base font-medium mb-3 transition-colors duration-200 ${isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        About
                    </NavLink>
                </div>

                {/* Enhanced Mobile User Section */}
                {token ? (
                    <div className='border-t border-gray-200 p-6'>
                        <div className='flex items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl'>
                            <img
                                className='rounded-full w-12 h-12 object-cover border-2 border-blue-200'
                                src={userData?.image || assets.default_avatar}
                                alt='Profile'
                            />
                            <div className='ml-4'>
                                <p className='font-semibold text-gray-900'>{userData?.name || 'User'}</p>
                                <p className='text-sm text-gray-600'>Welcome back!</p>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-3'>
                            <button
                                onClick={() => { navigate('/my-profile'); setShowMenu(false); window.scrollTo(0, 0) }}
                                className='text-left px-5 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors duration-200 flex items-center border border-gray-200'
                            >
                                <svg className='w-5 h-5 mr-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <div className='font-medium'>My Profile</div>
                                    <div className='text-xs text-gray-500'>Personal settings & preferences</div>
                                </div>
                            </button>
                            <button
                                onClick={() => { navigate('/my-appointment'); setShowMenu(false); window.scrollTo(0, 0) }}
                                className='text-left px-5 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors duration-200 flex items-center border border-gray-200'
                            >
                                <svg className='w-5 h-5 mr-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2m-6 0V7" />
                                </svg>
                                <div>
                                    <div className='font-medium'>My Appointments</div>
                                    <div className='text-xs text-gray-500'>Therapy appointments & history</div>
                                </div>
                            </button>
                            <button
                                onClick={() => { navigate('/assessments'); setShowMenu(false); window.scrollTo(0, 0) }}
                                className='text-left px-5 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors duration-200 flex items-center border border-gray-200'
                            >
                                <svg className='w-5 h-5 mr-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <div>
                                    <div className='font-medium'>My Assessments</div>
                                    <div className='text-xs text-gray-500'>Mental health evaluations</div>
                                </div>
                            </button>
                            <button
                                onClick={() => { logout(); setShowMenu(false); window.scrollTo(0, 0) }}
                                className='text-left px-5 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 flex items-center border border-red-200'
                            >
                                <svg className='w-5 h-5 mr-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <div>
                                    <div className='font-medium'>Logout</div>
                                    <div className='text-xs text-red-400'>Sign out securely</div>
                                </div>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='border-t border-gray-200 p-6 space-y-4'>
                        <div className='text-center mb-4'>
                            <p className='text-sm text-gray-600 mb-2'>Join our mental health community</p>
                        </div>
                        <button
                            onClick={() => { navigate('/login'); setShowMenu(false); window.scrollTo(0, 0) }}
                            className='w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-semibold transition-colors duration-200'
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { navigate('/signup'); setShowMenu(false); window.scrollTo(0, 0) }}
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors duration-200 shadow-lg'
                        >
                            Get Started Free
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar