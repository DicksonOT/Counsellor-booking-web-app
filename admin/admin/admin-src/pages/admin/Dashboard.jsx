import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import {assets} from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const {dashboardData, getDashboardData, aToken, pendingCounsellors} = useContext(AdminContext)
  const {formattedDateUniversal} = useContext(AppContext)

  // Format currency helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  useEffect(()=>{
    if(aToken){
      getDashboardData()
    }
  },[aToken])
  
  return dashboardData && (
    <div className='flex-1 p-5'>
      <p className='text-base  text-blue-600 font-semibold'>Welcome back! Here's what's happening with your platform today.</p>
      
      {/* Top 3 Cards with Revenue */}
      <div className='flex flex-wrap gap-5 mt-5'>

        {/* Total Revenue Card */}
        <div className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white p-4 min-w-52 rounded border-2 border-green-200 cursor-pointer hover:scale-105 transition-all'>
          <div className='bg-white/20 p-2 rounded-full'>
            <svg className='w-10 h-10' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'></path>
            </svg>
          </div>
          <div>
            <p className='text-2xl font-bold'>{formatCurrency(dashboardData.totalRevenue)}</p>
            <p className='text-green-100'>Total Revenue</p>
          </div>
        </div>

        {/* Counsellors Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt='' />
          <div onClick={()=>{navigate('/all-counsellors'); window.scrollTo(0,0)}}>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.counsellors}</p>
            <p className='text-gray-500'>Counsellors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt='' />
          <div onClick={()=>navigate('/all-appointments')}>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.appointments}</p>
            <p className='text-gray-500'>Appointments</p>
          </div>
        </div>

        {/* Users Card */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt='' />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashboardData.users}</p>
            <p className='text-gray-500'>Users</p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Section */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold text-gray-700 mb-4'>Revenue Breakdown</h3>
        <div className='flex flex-wrap gap-4'>
          
          {/* Appointment Revenue */}
          <div className='bg-white p-4 rounded-lg border border-gray-200 min-w-48 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-full'>
                <img className='w-8 h-8' src={assets.appointments_icon} alt='' />
              </div>
              <div>
                <p className='text-lg font-semibold text-blue-600'>{formatCurrency(dashboardData.appointmentRevenue)}</p>
                <p className='text-sm text-gray-600'>Appointment Bookings</p>
                <p className='text-xs text-gray-500'>{dashboardData.paidAppointments} paid appointments</p>
              </div>
            </div>
          </div>

          {/* Donation Revenue */}
          <div className='bg-white p-4 rounded-lg border border-gray-200 min-w-48 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='bg-green-100 p-2 rounded-full'>
                <svg className='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd'></path>
                </svg>
              </div>
              <div>
                <p className='text-lg font-semibold text-blue-600'>{formatCurrency(dashboardData.donationRevenue)}</p>
                <p className='text-sm text-gray-600'>Donations</p>
                <p className='text-xs text-gray-500'>{dashboardData.completedDonations} completed donations</p>
              </div>
            </div>
          </div>

          {/* Pending Counsellors */}
          <div className='bg-white p-4 rounded-lg border border-gray-200 min-w-48 shadow-sm'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-100 p-2 rounded-full'>
                <img className='w-8 h-8' src={assets.appointments_icon} alt='' />
              </div>
              <div onClick={()=>navigate('/approve-counsellors')} className='cursor-pointer'>
                <p className='text-lg font-semibold text-blue-600'>{pendingCounsellors.length}</p>
                <p className='text-sm text-gray-600'>Pending Counsellors</p>
                <p className='text-xs text-gray-500'>Awaiting approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white mt-8'>
        <div className='flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-200'>
          <img src={assets.list_icon} alt='' />
          <p className='font-semibold text-gray-700'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0 border-gray-200'>
          {
            dashboardData.latestAppointments.map((item, index)=>(
              <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
                <div className='bg-blue-200 rounded-full'>
                  <img className='rounded-full h-11 w-10' src={item.counData.image} alt='' />
                </div>
                <div className='flex-1 test-sm'>
                  <p className='text-gray-800 text-sm'>{item.counData.name}</p>
                  <p className='text-gray-600'>{formattedDateUniversal(item.slotDate)}</p>
                </div>
                <div className='text-right'>
                  {
                    item.cancelled 
                    ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                    : item.isCompleted
                    ? <p className="text-green-400 text-xs font-medium">Completed</p>
                    : <p className="text-blue-400 text-xs font-medium">Pending</p>
                  }
                  {item.amount > 0 && (
                    <p className='text-xs text-gray-500 mt-1'>{formatCurrency(item.amount)}</p>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Dashboard