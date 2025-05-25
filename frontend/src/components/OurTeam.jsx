import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const OurTeam = () => {
  const { team } = useContext(AppContext)

  return (
        <div className=" flex flex-col items-center mt-20 mx-20">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          Our Team
        </h1>
        <hr className="border-t-2 border-blue-400 my-4 w-15 ml-0" />
      <div className='flex gap-2 mt-5'>
        {
          team.map((item) => {
            return (
              <div className='p-6 rounded-4xl bg-blue-300 flex flex-col items-center m-2'>

                <img className='w-50 h-50 rounded-full' src={item.image} alt='' />

                <div className='flex flex-col items-center mt-5'>
                    <p className='font-bold text-xl'>{item.name}</p>
                    <p className='pt-5'>{item.about}</p>
                </div>

                <div className='flex gap-2 mt-3'>
                <Link>
                  <img className='w-10 h-10' src={assets.linkedin} alt='' />
                </Link>

                {item.id === 2 && (
                    <Link>
                      <img className='w-9 h-9' src={assets.github} alt='' />
                    </Link>
                )}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default OurTeam
