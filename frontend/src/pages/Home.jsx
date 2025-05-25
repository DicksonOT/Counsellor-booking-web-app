import React from 'react'
import Header from '../components/Header'
import Info from '../components/Info'
import SpecialtyMenu from '../components/SpecialtyMenu'
import Banner from '../components/Banner'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import Reviews from '../components/Community'

const home = () => {
  const navigate=useNavigate()
  return (
    <div>
      <Header />
      <Info />
      <div>
      <button
        onClick={() => {
          navigate("/about");
          scrollTo(0, 0);
        }}
        className="flex items-center px-5 py-3 rounded-full text-gray-800 text-sm hover:scale-105 transition-all bg-blue-200 cursor-pointer"
      >
        Read More 
        <img src={assets.arrow_icon} alt="" className="ml-2 w-4" />
      </button>
      </div>
      <SpecialtyMenu />
      <Reviews />
      <Banner />

    </div>
  )
}

export default home
