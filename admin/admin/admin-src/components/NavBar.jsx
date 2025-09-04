import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { CounsellorContext } from '../context/CounsellorContext'

const NavBar = ({ onToggleSidebar, isMobileSidebarOpen }) => {    
    const {aToken, setAToken} = useContext(AdminContext)
    const {cToken, setCToken} = useContext(CounsellorContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')

        cToken && setCToken('')
        cToken && localStorage.removeItem('cToken')
    }

    return (
        <div className='fixed top-0 left-0 right-0 bg-white border-b border-blue-200 px-4 z-30 lg:relative lg:z-auto'>
            <div className="flex justify-between items-center h-16">
                {/* Left Section - Mobile Menu + Logo */}
                <div className="flex items-center">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 mr-2"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d={isMobileSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                            />
                        </svg>
                    </button>

                    {/* Logo Section */}
                    <div 
                        onClick={() => navigate('/')} 
                        className='flex items-center cursor-pointer'
                    >
                        <img 
                            className='w-10 h-10 sm:w-12 sm:h-12 lg:w-15 lg:h-15' 
                            src={assets.logo} 
                            alt='Logo' 
                        />
                        <div className="ml-2">
                            <p className='text-blue-500 text-lg sm:text-xl lg:text-2xl italic font-semibold font-Arial'>
                                Quiet Place
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Role Badge + Logout */}
                <div className="flex items-center space-x-3">
                    {/* Role Badge */}
                    <div className="hidden sm:block">
                        <p className='border px-3 py-1 rounded-full border-gray-400 text-gray-600 text-sm bg-gray-50'>
                            {aToken ? 'Admin' : 'Counsellor'}
                        </p>
                    </div>

                    {/* Mobile Role Badge (Smaller) */}
                    <div className="sm:hidden">
                        <p className='border px-2 py-1 rounded-full border-gray-400 text-gray-600 text-xs bg-gray-50'>
                            {aToken ? 'Admin' : 'Counsellor'}
                        </p>
                    </div>

                    {/* Logout Button */}
                    <button 
                        onClick={logout} 
                        className='bg-blue-500 hover:bg-blue-600 text-white text-sm lg:text-base cursor-pointer rounded-full px-3 py-2 lg:px-4 lg:py-2 transition-colors duration-200 font-medium shadow-sm'
                    >
                        <span className="hidden sm:inline">Logout</span>
                        <span className="sm:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NavBar