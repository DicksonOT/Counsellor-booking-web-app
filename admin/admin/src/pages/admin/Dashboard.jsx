import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import {assets} from '../../assets/assets'

const Dashboard = () => {
  const navigate = useNavigate()
  const {dashboardData, getDashboardData, aToken} = useContext(AdminContext)

  useEffect(()=>{
    if(aToken){
      getDashboardData()
    }
  },[aToken])
  return dashboardData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-5'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.doctor_icon} alt='' />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.counsellors}</p>
          <p className='text-gray-400 '>Counsellors</p>
        </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.appointments_icon} alt='' />
        <div onClick={()=>navigate('/all-appointments')}>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.appointments}</p>
          <p className='text-gray-400 '>Appointments</p>
        </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt='' />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashboardData.users}</p>
          <p className='text-gray-400 '>Users</p>
        </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt='' />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div  className='pt-4 border border-t-0'>
          {
            dashboardData.lastestAppointments.map((item, index)=>(
              <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.counData.image} alt='' />
                <div className='flex-1 test-sm'>
                  <p className='text-gray-800 font-medium'>{item.counData.name}</p>
                  <p className='text-gray-600'>{item.slotDate}</p>
                </div>
              {
                item.cancelled 
                ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                : <p>...</p>
              } 
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Dashboard