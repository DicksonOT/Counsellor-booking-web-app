import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'

const MyAppointment = () => {
  const { backendUrl, token, getCounsellors } = useContext(AppContext)
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [payingId, setPayingId] = useState(null)
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [seeMore, setSeeMore] = useState(false)
  const [seeMoreValue, setSeeMoreValue] = useState(3)
  const navigate = useNavigate()

  const formattedDate = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios(`${backendUrl}/api/user/appointments`, { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      } else {
        toast.warn(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId)
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getCounsellors()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setCancellingId(null)
    }
  }

  const appointmentStripePay = async (appointmentId) => {
    try {
      setPayingId(appointmentId)
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, { headers: { token } })

      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
        setPayingId(null)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
      setPayingId(null)
    }
  }

  const verifyPayment = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, { sessionId })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        navigate('/my-appointment')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-600 font-medium text-sm">Cancelled</span>
        </div>
      )
    } else if (item.isCompleted) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-600 font-medium text-sm">Completed</span>
        </div>
      )
    } else if (item.payment) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600 font-medium text-sm">Confirmed</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-600 font-medium text-sm">Payment Pending</span>
        </div>
      )
    }
  }

  const getSessionTypeDisplay = (sessionType) => {
    if (!sessionType) return null
    
    switch(sessionType) {
      case 'online':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
            🌐 Online
          </span>
        )
      case 'physical':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
            🏢 In-Person
          </span>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (sessionId) {
      verifyPayment()
    }
  }, [sessionId])

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-9 bg-gray-50">
      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-96 px-5">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📅</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Appointments Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any appointments yet. Browse our counsellors and book your first session.
            </p>
            <button 
              onClick={() => navigate('/counsellors')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Browse Counsellors
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-5 pt-8 pb-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">My Appointments</h1>
            <p className="text-gray-600">Manage your counselling appointments</p>
          </div>

          <div className="space-y-6">
            {appointments.slice(0, seeMoreValue).map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Counsellor Image */}
                  <div className="flex-shrink-0">
                    <img 
                      className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-lg bg-blue-50 border border-blue-200" 
                      src={item.counData.image} 
                      alt={item.counData.name}
                    />
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.counData.name}</h3>
                      {getStatusBadge(item)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Specialty</p>
                        <p className="text-gray-900">{item.counData.specialty}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Location</p>
                        <p className="text-gray-900">{item.counData.location}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Date & Time</p>
                        <p className="text-gray-900 font-medium">
                          {formattedDate(item.slotDate)} at {item.slotTime}
                        </p>
                      </div>
                      {item.sessionType && (
                        <div>
                          <p className="text-gray-600 font-medium mb-1">Session Type</p>
                          {getSessionTypeDisplay(item.sessionType)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 min-w-fit">
                    {!item.cancelled && item.payment && !item.isCompleted && (
                      <div className="flex items-center justify-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-700 font-medium text-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Paid
                        </span>
                      </div>
                    )}

                    {!item.cancelled && !item.payment && !item.isCompleted && (
                      <button 
                        onClick={() => appointmentStripePay(item._id)}
                        disabled={payingId === item._id}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {payingId === item._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            💳 Pay Now
                          </>
                        )}
                      </button>
                    )}

                    {!item.cancelled && !item.isCompleted && (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        disabled={cancellingId === item._id}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {cancellingId === item._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            ❌ Cancel
                          </>
                        )}
                      </button>
                    )}

                    {item.cancelled && !item.isCompleted && (
                      <div className="flex items-center justify-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-700 font-medium text-sm">
                          Appointment Cancelled
                        </span>
                      </div>
                    )}

                    {item.isCompleted && (
                      <div className="flex items-center justify-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-700 font-medium text-sm flex items-center gap-2">
                          ✅ Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {appointments.length > 3 && (
            <div className="flex justify-center mt-8">
              {seeMore ? (
                <button 
                  onClick={() => { setSeeMore(false); setSeeMoreValue(3); }} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Show Less
                </button>
              ) : (
                <button  
                  onClick={() => { setSeeMore(true); setSeeMoreValue(appointments.length); }} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Show All ({appointments.length} appointments)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyAppointment