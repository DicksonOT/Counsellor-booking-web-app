import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const { token, setToken, userData } = useContext(AppContext)
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <div className='fixed top-0 left-0 z-50 w-full bg-white flex items-center justify-between text-sm py-3 px-4 border-b border-gray-200 shadow-sm'>
            {/* Logo Section */}
            <div 
                onClick={() => {navigate('/'); scrollTo(0,0)}} 
                className='flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200'
            >
                <img className='w-12 h-12 object-contain' src={assets.logo} alt='Quiet Place Logo' /> 
                <p className='text-blue-600 ml-2 text-xl font-semibold tracking-wide'>Quiet Place</p>
            </div>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex items-center gap-8 font-medium'>
                <NavLink to='/' onClick={scrollTo(0,0)} className={({ isActive }) => 
                    `relative py-2 px-1 transition-colors duration-200 hover:text-blue-600 ${
                        isActive ? 'text-blue-600' : 'text-gray-700'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <li>HOME</li>
                            {isActive && <hr className='absolute bottom-0 left-0 right-0 border-blue-600 border-t-2'/>}
                        </>
                    )}
                </NavLink>
                <NavLink to='/about' onClick={scrollTo(0,0)} className={({ isActive }) => 
                    `relative py-2 px-1 transition-colors duration-200 hover:text-blue-600 ${
                        isActive ? 'text-blue-600' : 'text-gray-700'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <li>ABOUT</li>
                            {isActive && <hr className='absolute bottom-0 left-0 right-0 border-blue-600 border-t-2'/>}
                        </>
                    )}
                </NavLink>
                <NavLink to='/counsellors' onClick={scrollTo(0,0)} className={({ isActive }) => 
                    `relative py-2 px-1 transition-colors duration-200 hover:text-blue-600 ${
                        isActive ? 'text-blue-600' : 'text-gray-700'
                    }`
                }>
                    {({ isActive }) => (
                        <>
                            <li>COUNSELLORS</li>
                            {isActive && <hr className='absolute bottom-0 left-0 right-0 border-blue-600 border-t-2'/>}
                        </>
                    )}
                </NavLink>
            </ul>

            {/* User Actions */}
            <div className='flex items-center gap-4'>
                {token ? (
                    <div className='flex items-center cursor-pointer group relative'>
                        <img 
                            className='rounded-full w-8 h-8 object-cover border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200' 
                            src={userData.image} 
                            alt='Profile'
                        />
                        <img 
                            className='p-2 w-8 h-8 group-hover:rotate-180 transition-transform duration-200' 
                            src={assets.dropdown_icon} 
                            alt='Dropdown'
                        />
                        <div className='absolute top-full right-0 mt-2 text-base font-medium text-gray-600 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                            <div className='min-w-48 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col overflow-hidden'>
                                <p 
                                    onClick={() => navigate('/my-profile')} 
                                    className='px-4 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100'
                                >
                                    My Profile
                                </p>
                                <p 
                                    onClick={() => navigate('/my-appointment')} 
                                    className='px-4 py-3 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-200 border-b border-gray-100'
                                >
                                    My Appointments
                                </p>
                                <p 
                                    onClick={logout} 
                                    className='px-4 py-3 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors duration-200 text-red-500'
                                >
                                    Logout
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/login')} 
                        className='rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md'
                    >
                        Create Account
                    </button>
                )}
                
                {/* Mobile Menu Button */}
                <img 
                    className='w-6 h-6 sm:hidden cursor-pointer hover:opacity-70 transition-opacity duration-200' 
                    onClick={() => setShowMenu(true)} 
                    src={assets.menu_icon} 
                    alt='Menu' 
                />
            </div>

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div 
                    className='fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden'
                    onClick={() => setShowMenu(false)}
                />
            )}

            {/* Mobile Menu */}
            <div className={`${
                showMenu ? 'translate-x-0' : 'translate-x-full'
            } fixed right-0 top-0 h-full w-80 max-w-sm bg-white z-40 sm:hidden transform transition-transform duration-300 ease-in-out shadow-xl`}>
                
                {/* Mobile Menu Header */}
                <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
                    <div className='flex items-center'>
                        <img className='w-10 h-10 object-contain' src={assets.logo} alt='Logo' />
                        <p className='text-blue-600 ml-2 text-lg font-semibold'>Quiet Place</p>
                    </div>
                    <img 
                        className='w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity duration-200' 
                        onClick={() => setShowMenu(false)} 
                        src={assets.cross_icon} 
                        alt='Close'
                    />
                </div>

                {/* Mobile Menu Links */}
                <div className='flex flex-col mt-8 px-5'>
                    <NavLink 
                        onClick={() => { setShowMenu(false); window.scrollTo(0, 0) }} 
                        to='/'
                        className={({ isActive }) => 
                            `px-4 py-4 rounded-lg text-lg font-medium mb-2 transition-colors duration-200 ${
                                isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        onClick={() => { setShowMenu(false); window.scrollTo(0, 0) }} 
                        to='/about'
                        className={({ isActive }) => 
                            `px-4 py-4 rounded-lg text-lg font-medium mb-2 transition-colors duration-200 ${
                                isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        About
                    </NavLink>
                    <NavLink 
                        onClick={() => { setShowMenu(false); window.scrollTo(0, 0) }} 
                        to='/counsellors'
                        className={({ isActive }) => 
                            `px-4 py-4 rounded-lg text-lg font-medium mb-2 transition-colors duration-200 ${
                                isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                            }`
                        }
                    >
                        Counsellors
                    </NavLink>
                </div>

                {/* Mobile User Section */}
                {token && (
                    <div className='absolute bottom-0 left-0 right-0 border-t border-gray-200 p-5'>
                        <div className='flex flex-col space-y-2'>
                            <button 
                                onClick={() => { navigate('/my-profile'); setShowMenu(false); scrollTo(0,0) }} 
                                className='text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                            >
                                My Profile
                            </button>
                            <button 
                                onClick={() => { navigate('/my-appointment'); setShowMenu(false); scrollTo(0,0) }} 
                                className='text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                            >
                                My Appointments
                            </button>
                            <button 
                                onClick={() => { logout(); setShowMenu(false); scrollTo(0,0) }} 
                                className='text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200'
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile Login Button */}
                {!token && (
                    <div className='absolute bottom-0 left-0 right-0 p-5'>
                        <button 
                            onClick={() => { navigate('/login'); setShowMenu(false); scrollTo(0,0) }} 
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200'
                        >
                            Create Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar