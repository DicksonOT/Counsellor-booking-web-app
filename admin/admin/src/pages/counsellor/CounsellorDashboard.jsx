import React, { useContext, useEffect } from 'react'
import { CounsellorContext } from '../../context/CounsellorContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const CounsellorDashboard = () => {
  const { cToken, dashBoard, dashInfo } = useContext(CounsellorContext)
  const { formattedDate, currency } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (cToken) {
      dashBoard()
    }
  }, [cToken, dashBoard])

  return dashInfo && (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Welcome Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome back!</h1>
        <p className='text-lg text-gray-600'>Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {/* Earnings Card */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-200'>
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-green-500 rounded-full'>
              <img className='w-8 h-8' src={assets.earning_icon} alt='Earnings' />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-green-700'>{currency} {dashInfo.earnings}</p>
              <p className='text-green-600 text-sm font-medium'>Total Earnings</p>
            </div>
          </div>
          <div className='flex items-center text-green-600'>
            <span className='text-xs font-medium bg-green-200 px-2 py-1 rounded-full'>This Month</span>
          </div>
        </div>

        {/* Appointments Card */}
        <div 
          className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-blue-200 group'
          onClick={() => navigate('/counsellor-appointments')}
        >
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors'>
              <img className='w-8 h-8' src={assets.appointments_icon} alt='Appointments' />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-blue-700'>{dashInfo.appointments}</p>
              <p className='text-blue-600 text-sm font-medium'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-medium bg-blue-200 px-2 py-1 rounded-full text-blue-700'>View All</span>
            <span className='text-blue-500 group-hover:translate-x-1 transition-transform'>→</span>
          </div>
        </div>

        {/* Clients Card */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200'>
          <div className='flex items-center justify-between mb-4'>
            <div className='p-3 bg-purple-500 rounded-full'>
              <img className='w-8 h-8' src={assets.patients_icon} alt='Clients' />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-purple-700'>{dashInfo.clients}</p>
              <p className='text-purple-600 text-sm font-medium'>Total Clients</p>
            </div>
          </div>
          <div className='flex items-center text-purple-600'>
            <span className='text-xs font-medium bg-purple-200 px-2 py-1 rounded-full'>Active</span>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-200'>
        {/* Header */}
        <div className='bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <img src={assets.list_icon} alt='List' className='w-5 h-5' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>Latest Bookings</h2>
              <p className='text-sm text-gray-600'>Recent appointments overview</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className='divide-y divide-gray-100'>
          {dashInfo.latestAppointments.length === 0 ? (
            <div className='p-8 text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <img src={assets.appointments_icon} alt='No appointments' className='w-8 h-8 opacity-50' />
              </div>
              <p className='text-gray-500 font-medium'>No recent appointments</p>
              <p className='text-gray-400 text-sm'>New bookings will appear here</p>
            </div>
          ) : (
            dashInfo.latestAppointments.map((item, index) => (
              <div 
                className='flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group' 
                key={index}
                onClick={() => navigate(`/counsellor/client-profile/${item.userId}`, {
                  state: { appointmentData: item, clientData: item.counData }
                })}
              >
                {/* Client Avatar */}
                <div className='relative'>
                  <div className='w-14 h-14 rounded-full overflow-hidden border-3 border-blue-100 shadow-sm'>
                    <img 
                      className='w-full h-full object-cover' 
                      src={item.counData.image || assets.profile_placeholder} 
                      alt={item.counData.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_placeholder; }}
                    />
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></div>
                </div>

                {/* Client Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='font-semibold text-gray-900 truncate'>{item.counData.name}</p>
                    {item.payment && (
                      <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Paid
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                    <span className='flex items-center gap-1'>
                      📅 {formattedDate(item.slotDate)}
                    </span>
                    <span className='flex items-center gap-1'>
                      ⏰ {item.slotTime}
                    </span>
                    {item.amount && (
                      <span className='flex items-center gap-1 font-medium'>
                        💰 {currency} {item.amount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Action */}
                <div className='flex items-center gap-3'>
                  {item.cancelled ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      ❌ Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      ✅ Completed
                    </span>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        📋 Scheduled
                      </span>
                      <button className='text-blue-600 hover:text-blue-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
                        View →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Footer */}
        {dashInfo.latestAppointments.length > 0 && (
          <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
            <button 
              onClick={() => navigate('/counsellor-appointments')}
              className='w-full text-center py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg'
            >
              View All Appointments →
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className='mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <button 
          onClick={() => navigate('/counsellor/profile')}
          className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 group'
        >
          <div className='p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
            👤
          </div>
          <div className='text-left'>
            <p className='font-medium text-gray-900'>Profile</p>
            <p className='text-sm text-gray-600'>Update info</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/counsellor/appointments')}
          className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-green-300 group'
        >
          <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
            📅
          </div>
          <div className='text-left'>
            <p className='font-medium text-gray-900'>Schedule</p>
            <p className='text-sm text-gray-600'>Manage slots</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/counsellor/sessions')}
          className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-purple-300 group'
        >
          <div className='p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors'>
            💻
          </div>
          <div className='text-left'>
            <p className='font-medium text-gray-900'>Sessions</p>
            <p className='text-sm text-gray-600'>Online meetings</p>
          </div>
        </button>

        <button 
          onClick={() => navigate('/counsellor/reports')}
          className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-orange-300 group'
        >
          <div className='p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
            📊
          </div>
          <div className='text-left'>
            <p className='font-medium text-gray-900'>Reports</p>
            <p className='text-sm text-gray-600'>Analytics</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default CounsellorDashboard