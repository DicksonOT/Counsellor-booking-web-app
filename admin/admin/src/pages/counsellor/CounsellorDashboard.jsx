import React, { useContext, useEffect } from 'react'
import { CounsellorContext } from '../../context/CounsellorContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const CounsellorDashboard = () => {
  const {cToken, dashBoard, dashInfo, setDashInfo} = useContext(CounsellorContext)
  const {formattedDate, currency} = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
      if (cToken) {
        dashBoard()
      }
  }, [cToken, dashBoard])

  return dashInfo &&  (
    <div className='m-5'>
      <p className='text-base font-semibold'>Welcome back! Here's what's happening with your platform today.</p>
      <div className='flex flex-wrap gap-5 mt-5'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.earning_icon} alt='' />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{currency} {dashInfo.earnings}</p>
          <p className='text-gray-500 '>Earnings</p>
        </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.appointments_icon} alt='' />
        <div onClick={()=>navigate('/counsellor-appointments')}>
          <p className='text-xl font-semibold text-gray-600'>{dashInfo.appointments}</p>
          <p className='text-gray-500 '>Appointments</p>
        </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
        <img className='w-14' src={assets.patients_icon} alt='' />
        <div>
          <p className='text-xl font-semibold text-gray-600'>{dashInfo.clients}</p>
          <p className='text-gray-500 '>Clients</p>
        </div>
        </div>
      </div>

      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-200'>
          <img src={assets.list_icon} alt='' />
          <p className='font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div  className='pt-4 border border-t-0  border-gray-200'>
          {
            dashInfo.latestAppointments.map((item, index)=>(
              <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
                <div className='bg-blue-200 rounded-full'>
                <img className='rounded-full h-11 w-10' src={item.counData.image} alt='' />
                </div>
                <div className='flex-1 test-sm'>
                  <p className='text-gray-800 text-sm'>{item.counData.name}</p>
                  <p className='text-gray-600'>{formattedDate(item.slotDate)}</p>
                </div>
              {
                item.cancelled 
                ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                : item.isCompleted
                ? <p className="text-green-400 text-xs font-medium">Completed</p>
                :<p>...</p>
              } 
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default CounsellorDashboard