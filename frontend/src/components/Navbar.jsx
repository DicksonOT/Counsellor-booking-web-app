import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const {token, setToken} = useContext(AppContext)
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)

    const logout = () =>{
        setToken(false)
        localStorage.removeItem('token')
        navigate('/')
    }
  return (
    <div className='flex items-center justify-between text-sm py-1 mb-5 border-b border-b-gray-400'>
        <div  onClick={()=>navigate('/')} className='flex cursor-pointer'>
        <img className='w-25 h-15' src={assets.logo} alt=''/> 
        <p className='text-blue-500 mt-4 text-2xl italic font-semibold'>Quiet Place</p>
        </div>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className=' hidden border-blue-400'/>
            </NavLink>
            <NavLink to='/about'>
            <li className='py-1'>ABOUT</li>
                <hr className=' hidden border-blue-400 '/>
            </NavLink>
            <NavLink to='/counsellors'>
            <li className='py-1'>COUNSELLORS</li>
                <hr className=' hidden border-blue-400'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token
                ?<div className='flex items-center cursor-pointer group relative'>
                    <img className='rounded-full w-6' src={assets.profile_pic} alt=''/>
                    <img className='p-2 group-hover:hidden' src={assets.dropdown_icon} alt=''/>
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20  hidden border-blue-400 group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                        <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                        <p  onClick={()=>navigate('my-appointment')}  className='hover:text-black cursor-pointer'>My Appointments</p>
                        <p onClick={logout}  className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                : <button onClick={()=>navigate('/login')} className='rounded-full p-2 bg-blue-500 text-white cursor-pointer'>Create Account</button>
            }
            <img className='w-6 sm:hidden cursor-pointer' onClick={()=>setShowMenu(true)} src={assets.menu_icon} alt='' /> 
            {/* ---------Mobile Menu----------- */}
            <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} sm:hidden right-0 top-0 overflow-hidden z-20 bg-white transition-all border border-blue-300 rounded-lg`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-25 h-15' src={assets.logo} alt='' />
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt='' />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>{setShowMenu(false), scrollTo(0,0)}} to='/'><p className='px-4 y-2 rounded inline-block text-blue-500'>Home</p></NavLink>
                    <NavLink onClick={()=>{setShowMenu(false), scrollTo(0,0)}} to='/about'><p className='px-4 y-2 rounded inline-block text-blue-500'>About</p></NavLink>  
                    <NavLink onClick={()=>{setShowMenu(false), scrollTo(0,0)}} to='/counsellors'><p className='px-4 y-2 rounded inline-block text-blue-500'>Counsellors</p></NavLink>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar

