import React, { useContext} from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { CounsellorContext } from '../context/CounsellorContext'

const NavBar = () => {    
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
    <div className='flex justify-between items-center bg-white border-b px-4'>
        <div className='flex items-center text-xs'>
             <img className='w-25 h-15 cursor-pointer' src={assets.logo} alt='' />
             <p className='text-blue-500 mt-4 text-2xl italic font-semibold font-Arial'>Quiet Place</p>
            <p className='m-4 mt-9 border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Counsellor'}</p>
        </div>
        <button onClick={logout} className='bg-blue-500 text-white text-base cursor-pointer rounded-full p-1.5'>Logout</button>
    </div>
  )
}

export default NavBar